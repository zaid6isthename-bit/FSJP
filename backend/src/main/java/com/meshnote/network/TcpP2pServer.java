package com.meshnote.network;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.meshnote.config.AppProperties;
import com.meshnote.dto.FileDto;
import com.meshnote.model.ActivityEvent;
import com.meshnote.model.NetworkEventType;
import com.meshnote.model.SharedFile;
import com.meshnote.model.UserProfile;
import com.meshnote.repository.ActivityRepository;
import com.meshnote.repository.SharedFileRepository;
import com.meshnote.service.ProfileService;
import com.meshnote.util.FileStorageUtil;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class TcpP2pServer {

    private static final Logger log = LoggerFactory.getLogger(TcpP2pServer.class);

    private final AppProperties appProperties;
    private final ProfileService profileService;
    private final SharedFileRepository sharedFileRepository;
    private final ActivityRepository activityRepository;
    private final FileStorageUtil fileStorageUtil;
    private final ExecutorService executorService;
    private final ObjectMapper objectMapper;

    private ServerSocket serverSocket;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread acceptThread;

    public TcpP2pServer(AppProperties appProperties,
                        ProfileService profileService,
                        SharedFileRepository sharedFileRepository,
                        ActivityRepository activityRepository,
                        FileStorageUtil fileStorageUtil,
                        @Qualifier("p2pServerExecutor") ExecutorService executorService,
                        ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.profileService = profileService;
        this.sharedFileRepository = sharedFileRepository;
        this.activityRepository = activityRepository;
        this.fileStorageUtil = fileStorageUtil;
        this.executorService = executorService;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void start() {
        try {
            int port = appProperties.getP2pPort();
            serverSocket = new ServerSocket(port);
            running.set(true);
            log.info("TCP P2P Server started on port {}", port);

            acceptThread = new Thread(this::acceptLoop, "Meshnote-P2P-Acceptor");
            acceptThread.setDaemon(true);
            acceptThread.start();
        } catch (IOException e) {
            log.error("Failed to bind TCP P2P Server to port {}: {}", appProperties.getP2pPort(), e.getMessage());
        }
    }

    private void acceptLoop() {
        while (running.get()) {
            try {
                Socket clientSocket = serverSocket.accept();
                clientSocket.setSoTimeout(30000); // 30s connection timeout
                executorService.submit(() -> handleClient(clientSocket));
            } catch (SocketException e) {
                if (!running.get()) break;
                log.warn("P2P server socket exception: {}", e.getMessage());
            } catch (Exception e) {
                log.error("Error accepting P2P client connection", e);
            }
        }
    }

    private void handleClient(Socket socket) {
        try (socket;
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
             OutputStream outputStream = new BufferedOutputStream(socket.getOutputStream(), 64 * 1024)) {

            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.trim().isEmpty()) return;

            JsonNode request = objectMapper.readTree(headerLine);
            String type = request.path("type").asText("");

            switch (type) {
                case "PING":
                    handlePing(outputStream);
                    break;
                case "LIST_FILES":
                    handleListFiles(outputStream);
                    break;
                case "GET_FILE":
                    handleGetFile(request, outputStream, socket.getInetAddress().getHostAddress());
                    break;
                default:
                    sendError(outputStream, "UNKNOWN_COMMAND", "Unsupported message type: " + type);
                    break;
            }

        } catch (Exception e) {
            if (appProperties.isDebug()) {
                log.warn("P2P connection handler error: {}", e.getMessage());
            }
        }
    }

    private void handlePing(OutputStream out) throws IOException {
        ObjectNode pong = objectMapper.createObjectNode();
        pong.put("type", "PONG");
        pong.put("status", "OK");
        sendJsonLine(out, pong);
    }

    private void handleListFiles(OutputStream out) throws IOException {
        UserProfile profile = profileService.getOrCreateProfile();
        ObjectNode response = objectMapper.createObjectNode();
        response.put("type", "FILE_LIST");
        ArrayNode filesArray = response.putArray("files");

        // If sharing is disabled locally, return empty list
        if (profile.isSharingEnabled()) {
            List<SharedFile> files = sharedFileRepository.findAllShared();
            for (SharedFile file : files) {
                ObjectNode item = filesArray.addObject();
                item.put("id", file.getId());
                item.put("name", file.getOriginalName());
                item.put("mimeType", file.getMimeType());
                item.put("type", FileDto.determineType(file.getOriginalName(), file.getMimeType()));
                item.put("sizeBytes", file.getSizeBytes());
                item.put("subject", file.getSubject());
                item.put("module", file.getModule());
                item.put("semester", file.getSemester());
                item.put("description", file.getDescription());
                item.put("ownerName", profile.getName());
                item.put("peerId", profile.getId());
                item.put("accessCount", file.getAccessCount());
            }
        }

        sendJsonLine(out, response);
    }

    private void handleGetFile(JsonNode request, OutputStream out, String clientIp) throws IOException {
        UserProfile profile = profileService.getOrCreateProfile();

        if (!profile.isSharingEnabled()) {
            sendError(out, "SHARING_DISABLED", "Peer has disabled file sharing");
            return;
        }

        String fileId = request.path("fileId").asText();
        Optional<SharedFile> fileOpt = sharedFileRepository.findById(fileId);

        if (fileOpt.isEmpty() || !fileOpt.get().isShared()) {
            sendError(out, "FILE_NOT_FOUND", "The requested file is not available");
            return;
        }

        SharedFile file = fileOpt.get();
        File diskFile = fileStorageUtil.getSharedFile(file.getStoredName());

        if (!diskFile.exists()) {
            sendError(out, "FILE_MISSING_ON_DISK", "File metadata exists but physical file is missing");
            return;
        }

        // Send metadata header
        ObjectNode header = objectMapper.createObjectNode();
        header.put("type", "FILE");
        header.put("status", "OK");
        header.put("fileId", file.getId());
        header.put("name", file.getOriginalName());
        header.put("mimeType", file.getMimeType());
        header.put("sizeBytes", file.getSizeBytes());
        sendJsonLine(out, header);

        // Stream file binary content in 64KB buffer
        try (InputStream fileIn = new BufferedInputStream(new FileInputStream(diskFile), 64 * 1024)) {
            byte[] buffer = new byte[64 * 1024];
            int bytesRead;
            while ((bytesRead = fileIn.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            out.flush();
        }

        // Update stats
        sharedFileRepository.incrementAccessCount(file.getId());
        activityRepository.save(new ActivityEvent(
                null,
                NetworkEventType.MATERIAL_DOWNLOADED,
                "Shared file sent: " + file.getOriginalName(),
                "Streamed to peer at " + clientIp,
                null,
                LocalDateTime.now()
        ));
        log.info("Successfully streamed file '{}' ({} bytes) to peer at {}", file.getOriginalName(), file.getSizeBytes(), clientIp);
    }

    private void sendJsonLine(OutputStream out, ObjectNode node) throws IOException {
        byte[] jsonBytes = objectMapper.writeValueAsBytes(node);
        out.write(jsonBytes);
        out.write('\n');
        out.flush();
    }

    private void sendError(OutputStream out, String code, String message) throws IOException {
        ObjectNode err = objectMapper.createObjectNode();
        err.put("type", "ERROR");
        err.put("status", "ERROR");
        err.put("errorCode", code);
        err.put("message", message);
        sendJsonLine(out, err);
    }

    @PreDestroy
    public void stop() {
        running.set(false);
        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
        } catch (IOException ignored) {}
        if (acceptThread != null) {
            acceptThread.interrupt();
        }
        log.info("TCP P2P Server stopped");
    }
}
