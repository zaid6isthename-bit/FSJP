package com.meshnote.service;

import com.meshnote.dto.PeerDto;
import com.meshnote.model.*;
import com.meshnote.repository.ActivityRepository;
import com.meshnote.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PeerRegistryService {

    private static final Logger log = LoggerFactory.getLogger(PeerRegistryService.class);

    private final Map<String, PeerInfo> peerMap = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;
    private final ActivityRepository activityRepository;

    public PeerRegistryService(NotificationRepository notificationRepository,
                               ActivityRepository activityRepository) {
        this.notificationRepository = notificationRepository;
        this.activityRepository = activityRepository;
    }

    /**
     * Updates or registers a discovered peer from a UDP HELLO beacon.
     */
    public void registerOrUpdatePeer(PeerInfo peer) {
        if (peer == null || peer.getNodeId() == null) return;

        PeerInfo existing = peerMap.get(peer.getNodeId());
        boolean isNew = (existing == null);
        boolean wasOffline = (existing != null && existing.getStatus() == PeerStatus.OFFLINE);

        peer.setStatus(PeerStatus.ONLINE);
        peer.setLastSeen(LocalDateTime.now());
        peerMap.put(peer.getNodeId(), peer);

        if (isNew || wasOffline) {
            log.info("Discovered peer: {} ({}) at {}:{}", peer.getName(), peer.getDeviceName(), peer.getIpAddress(), peer.getP2pPort());
            // Record activity
            activityRepository.save(new ActivityEvent(
                    null,
                    NetworkEventType.PEER_JOINED,
                    peer.getName() + " joined the network",
                    "Device " + peer.getDeviceName() + " (" + peer.getDivision() + ", Sem " + peer.getSemester() + ") is now nearby",
                    peer.getNodeId(),
                    LocalDateTime.now()
            ));

            // Record notification
            notificationRepository.save(new Notification(
                    null,
                    NotificationType.PEER_JOINED,
                    "New peer nearby: " + peer.getName(),
                    peer.getDeviceName() + " joined with " + peer.getSharedFileCount() + " shared files",
                    false,
                    LocalDateTime.now()
            ));
        } else {
            // Update mutable fields
            existing.setName(peer.getName());
            existing.setDivision(peer.getDivision());
            existing.setSemester(peer.getSemester());
            existing.setDeviceName(peer.getDeviceName());
            existing.setIpAddress(peer.getIpAddress());
            existing.setApiPort(peer.getApiPort());
            existing.setP2pPort(peer.getP2pPort());
            existing.setSharedFileCount(peer.getSharedFileCount());
            existing.setLastSeen(LocalDateTime.now());
            existing.setStatus(PeerStatus.ONLINE);
        }
    }

    /**
     * Checks all peers for heartbeat timeout and marks expired peers OFFLINE.
     */
    public void expirePeers(long timeoutMillis) {
        LocalDateTime now = LocalDateTime.now();
        for (PeerInfo peer : peerMap.values()) {
            if (peer.getStatus() == PeerStatus.ONLINE && peer.getLastSeen() != null) {
                long millisSince = Duration.between(peer.getLastSeen(), now).toMillis();
                if (millisSince > timeoutMillis) {
                    peer.setStatus(PeerStatus.OFFLINE);
                    log.info("Peer {} timed out and is now OFFLINE", peer.getName());

                    activityRepository.save(new ActivityEvent(
                            null,
                            NetworkEventType.PEER_LEFT,
                            peer.getName() + " disconnected",
                            peer.getDeviceName() + " left the local network",
                            peer.getNodeId(),
                            now
                    ));

                    notificationRepository.save(new Notification(
                            null,
                            NotificationType.PEER_LEFT,
                            peer.getName() + " is offline",
                            "Connection lost to " + peer.getDeviceName(),
                            false,
                            now
                    ));
                }
            }
        }
    }

    public List<PeerInfo> getAllPeers() {
        return new ArrayList<>(peerMap.values());
    }

    public List<PeerInfo> getOnlinePeers() {
        return peerMap.values().stream()
                .filter(p -> p.getStatus() == PeerStatus.ONLINE)
                .collect(Collectors.toList());
    }

    public Optional<PeerInfo> getPeer(String nodeId) {
        return Optional.ofNullable(peerMap.get(nodeId));
    }

    public int getOnlinePeerCount() {
        return (int) peerMap.values().stream().filter(p -> p.getStatus() == PeerStatus.ONLINE).count();
    }

    public PeerDto toDto(PeerInfo peer) {
        String lastSeenText = formatLastSeen(peer.getLastSeen());
        return new PeerDto(
                peer.getNodeId(),
                peer.getName(),
                peer.getDivision(),
                peer.getSemester(),
                peer.getDeviceName(),
                peer.getIpAddress(),
                peer.getApiPort(),
                peer.getP2pPort(),
                peer.getStatus(),
                peer.getSharedFileCount(),
                peer.getLastSeen(),
                lastSeenText
        );
    }

    private String formatLastSeen(LocalDateTime lastSeen) {
        if (lastSeen == null) return "Unknown";
        long seconds = Duration.between(lastSeen, LocalDateTime.now()).getSeconds();
        if (seconds < 5) return "Just now";
        if (seconds < 60) return seconds + "s ago";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + "m ago";
        return (minutes / 60) + "h ago";
    }
}
