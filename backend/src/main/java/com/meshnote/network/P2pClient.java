package com.meshnote.network;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.meshnote.dto.FileDto;
import com.meshnote.exception.MeshnoteException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class P2pClient {

    private static final Logger log = LoggerFactory.getLogger(P2pClient.class);
    private final ObjectMapper objectMapper;

    public interface ProgressCallback {
        void onProgress(long bytesTransferred, long bytesTotal, long speedBps);
        boolean isCancelled();
    }

    public P2pClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public boolean pingPeer(String ip, int p2pPort) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ip, p2pPort), 2000);
            socket.setSoTimeout(3000);

            OutputStream out = socket.getOutputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));

            out.write("{\"type\":\"PING\"}\n".getBytes(StandardCharsets.UTF_8));
            out.flush();

            String responseLine = reader.readLine();
            if (responseLine != null) {
                JsonNode res = objectMapper.readTree(responseLine);
                return "PONG".equals(res.path("type").asText());
            }
        } catch (Exception e) {
            log.debug("Ping failed to {}:{} - {}", ip, p2pPort, e.getMessage());
        }
        return false;
    }

    public List<FileDto> queryRemoteFiles(String ip, int p2pPort, String peerId, String peerName) {
        List<FileDto> fileList = new ArrayList<>();
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ip, p2pPort), 3000);
            socket.setSoTimeout(6000);

            OutputStream out = socket.getOutputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));

            out.write("{\"type\":\"LIST_FILES\"}\n".getBytes(StandardCharsets.UTF_8));
            out.flush();

            String responseLine = reader.readLine();
            if (responseLine != null) {
                JsonNode res = objectMapper.readTree(responseLine);
                JsonNode filesArray = res.path("files");
                if (filesArray.isArray()) {
                    for (JsonNode item : filesArray) {
                        FileDto dto = new FileDto();
                        dto.setId(item.path("id").asText());
                        dto.setName(item.path("name").asText());
                        dto.setMimeType(item.path("mimeType").asText("application/octet-stream"));
                        dto.setType(item.path("type").asText("FILE"));
                        dto.setSizeBytes(item.path("sizeBytes").asLong(0));
                        dto.setSubject(item.path("subject").asText("Academic"));
                        dto.setModule(item.path("module").asText("General"));
                        dto.setSemester(item.path("semester").asInt(3));
                        dto.setDescription(item.path("description").asText(""));
                        dto.setOwnerName(item.path("ownerName").asText(peerName));
                        dto.setPeerId(peerId);
                        dto.setAvailable(true);
                        dto.setShared(true);
                        dto.setAccessCount(item.path("accessCount").asInt(0));
                        fileList.add(dto);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to query files from peer {} at {}:{} - {}", peerName, ip, p2pPort, e.getMessage());
        }
        return fileList;
    }

    public void downloadFile(String ip, int p2pPort, String fileId, File destination, ProgressCallback callback) throws IOException {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ip, p2pPort), 5000);
            socket.setSoTimeout(30000);

            OutputStream socketOut = socket.getOutputStream();
            InputStream rawSocketIn = socket.getInputStream();

            // Send GET_FILE request
            ObjectNode request = objectMapper.createObjectNode();
            request.put("type", "GET_FILE");
            request.put("fileId", fileId);
            byte[] requestBytes = objectMapper.writeValueAsBytes(request);
            socketOut.write(requestBytes);
            socketOut.write('\n');
            socketOut.flush();

            // Read the newline-delimited JSON header byte by byte until newline
            ByteArrayOutputStream headerBuffer = new ByteArrayOutputStream();
            int b;
            while ((b = rawSocketIn.read()) != -1) {
                if (b == '\n') break;
                headerBuffer.write(b);
            }

            String headerLine = headerBuffer.toString(StandardCharsets.UTF_8);
            if (headerLine.trim().isEmpty()) {
                throw new IOException("Remote peer closed connection before sending file header");
            }

            JsonNode header = objectMapper.readTree(headerLine);
            String status = header.path("status").asText();
            if (!"OK".equals(status)) {
                String errMsg = header.path("message").asText("Download rejected by peer");
                throw new MeshnoteException(errMsg, "PEER_TRANSFER_REJECTED");
            }

            long totalBytes = header.path("sizeBytes").asLong(0);

            // Stream binary file to destination disk file
            try (BufferedInputStream bis = new BufferedInputStream(rawSocketIn, 64 * 1024);
                 BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(destination), 64 * 1024)) {

                byte[] buffer = new byte[64 * 1024];
                long transferred = 0;
                long lastTime = System.currentTimeMillis();
                long lastTransferred = 0;
                long speedBps = 0;

                int read;
                while ((read = bis.read(buffer)) != -1) {
                    if (callback != null && callback.isCancelled()) {
                        throw new IOException("Transfer was cancelled by user");
                    }

                    bos.write(buffer, 0, read);
                    transferred += read;

                    long now = System.currentTimeMillis();
                    long elapsed = now - lastTime;
                    if (elapsed >= 500) { // update speed every 500ms
                        speedBps = ((transferred - lastTransferred) * 1000) / Math.max(1, elapsed);
                        lastTime = now;
                        lastTransferred = transferred;
                        if (callback != null) {
                            callback.onProgress(transferred, totalBytes, speedBps);
                        }
                    }

                    if (totalBytes > 0 && transferred >= totalBytes) {
                        break; // Exactly the file length read
                    }
                }
                bos.flush();

                if (callback != null) {
                    callback.onProgress(transferred, totalBytes, 0);
                }
            }
        }
    }
}
