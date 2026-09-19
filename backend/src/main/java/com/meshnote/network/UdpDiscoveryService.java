package com.meshnote.network;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.meshnote.config.AppProperties;
import com.meshnote.model.PeerInfo;
import com.meshnote.model.PeerStatus;
import com.meshnote.model.UserProfile;
import com.meshnote.repository.SharedFileRepository;
import com.meshnote.service.PeerRegistryService;
import com.meshnote.service.ProfileService;
import com.meshnote.util.NetworkUtils;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class UdpDiscoveryService {

    private static final Logger log = LoggerFactory.getLogger(UdpDiscoveryService.class);

    private final AppProperties appProperties;
    private final ProfileService profileService;
    private final SharedFileRepository sharedFileRepository;
    private final PeerRegistryService peerRegistryService;
    private final ScheduledExecutorService scheduler;
    private final ObjectMapper objectMapper;

    @Value("${server.port:8080}")
    private int serverPort;

    private DatagramSocket socket;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread listenerThread;
    private volatile LocalDateTime lastHeartbeat = LocalDateTime.now();

    public UdpDiscoveryService(AppProperties appProperties,
                               ProfileService profileService,
                               SharedFileRepository sharedFileRepository,
                               PeerRegistryService peerRegistryService,
                               ScheduledExecutorService discoveryScheduler,
                               ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.profileService = profileService;
        this.sharedFileRepository = sharedFileRepository;
        this.peerRegistryService = peerRegistryService;
        this.scheduler = discoveryScheduler;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void start() {
        try {
            int port = appProperties.getDiscoveryPort();
            socket = new DatagramSocket(null);
            socket.setReuseAddress(true);
            socket.setBroadcast(true);
            socket.bind(new InetSocketAddress(port));

            running.set(true);
            log.info("UDP Discovery service started on port {}", port);

            // Start listener thread
            listenerThread = new Thread(this::listenLoop, "Meshnote-UDP-Listener");
            listenerThread.setDaemon(true);
            listenerThread.start();

            // Schedule periodic broadcast and peer expiration check
            scheduler.scheduleAtFixedRate(this::broadcastBeacon, 1000, appProperties.getDiscoveryInterval(), TimeUnit.MILLISECONDS);
            scheduler.scheduleAtFixedRate(() -> peerRegistryService.expirePeers(appProperties.getPeerTimeout()),
                    appProperties.getDiscoveryInterval(), appProperties.getDiscoveryInterval(), TimeUnit.MILLISECONDS);

        } catch (Exception e) {
            log.error("Failed to start UDP Discovery service on port {}: {}", appProperties.getDiscoveryPort(), e.getMessage());
        }
    }

    private void listenLoop() {
        byte[] buffer = new byte[4096];
        while (running.get()) {
            try {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);

                String json = new String(packet.getData(), packet.getOffset(), packet.getLength(), StandardCharsets.UTF_8);
                processIncomingPacket(json, packet.getAddress());
            } catch (SocketException e) {
                if (!running.get()) break; // Clean shutdown
                log.warn("UDP socket closed: {}", e.getMessage());
            } catch (Exception e) {
                if (appProperties.isDebug()) {
                    log.warn("Error processing UDP discovery packet: {}", e.getMessage());
                }
            }
        }
    }

    public void processIncomingPacket(String json, InetAddress senderAddress) {
        try {
            JsonNode root = objectMapper.readTree(json);
            if (!root.has("type") || !"HELLO".equals(root.get("type").asText())) {
                return;
            }

            UserProfile localProfile = profileService.getOrCreateProfile();
            String incomingNodeId = root.path("nodeId").asText();

            // Ignore our own broadcast
            if (localProfile.getId().equals(incomingNodeId)) {
                return;
            }

            PeerInfo peer = new PeerInfo();
            peer.setNodeId(incomingNodeId);
            peer.setName(root.path("name").asText("Unknown Peer"));
            peer.setDeviceName(root.path("deviceName").asText("Device"));
            peer.setDivision(root.path("division").asText(""));
            peer.setSemester(root.path("semester").asInt(3));
            peer.setApiPort(root.path("apiPort").asInt(8080));
            peer.setP2pPort(root.path("p2pPort").asInt(49000));
            peer.setSharedFileCount(root.path("sharedFileCount").asInt(0));
            peer.setIpAddress(senderAddress.getHostAddress());
            peer.setStatus(PeerStatus.ONLINE);
            peer.setLastSeen(LocalDateTime.now());

            peerRegistryService.registerOrUpdatePeer(peer);

        } catch (Exception e) {
            if (appProperties.isDebug()) {
                log.warn("Malformed UDP payload ignored: {}", e.getMessage());
            }
        }
    }

    public synchronized void broadcastBeacon() {
        if (!running.get() || socket == null || socket.isClosed()) return;

        try {
            UserProfile profile = profileService.getOrCreateProfile();
            if (!profile.isDiscoverable()) {
                // If user toggled discoverable off, do not broadcast
                return;
            }

            int sharedCount = sharedFileRepository.countShared();

            ObjectNode node = objectMapper.createObjectNode();
            node.put("type", "HELLO");
            node.put("protocol", "MESHNOTE/1");
            node.put("nodeId", profile.getId());
            node.put("name", profile.getName());
            node.put("deviceName", profile.getDeviceName());
            node.put("division", profile.getDivision());
            node.put("semester", profile.getSemester());
            node.put("apiPort", serverPort);
            node.put("p2pPort", appProperties.getP2pPort());
            node.put("sharedFileCount", sharedCount);
            node.put("timestamp", System.currentTimeMillis());

            byte[] bytes = objectMapper.writeValueAsBytes(node);

            List<InetAddress> targets = NetworkUtils.getBroadcastAddresses();
            for (InetAddress target : targets) {
                try {
                    DatagramPacket packet = new DatagramPacket(bytes, bytes.length, target, appProperties.getDiscoveryPort());
                    socket.send(packet);
                } catch (Exception ignored) {}
            }

            this.lastHeartbeat = LocalDateTime.now();
            if (appProperties.isDebug()) {
                log.info("Sent UDP discovery broadcast to {} interfaces", targets.size());
            }
        } catch (Exception e) {
            log.warn("Error sending UDP discovery broadcast: {}", e.getMessage());
        }
    }

    public boolean isRunning() {
        return running.get();
    }

    public LocalDateTime getLastHeartbeat() {
        return lastHeartbeat;
    }

    @PreDestroy
    public void stop() {
        running.set(false);
        if (socket != null && !socket.isClosed()) {
            socket.close();
        }
        if (listenerThread != null) {
            listenerThread.interrupt();
        }
        log.info("UDP Discovery service stopped");
    }
}
