package com.meshnote.dto;

import jakarta.validation.constraints.NotBlank;

public class DownloadRequest {
    @NotBlank(message = "Peer ID is required")
    private String peerId;

    @NotBlank(message = "File ID is required")
    private String fileId;

    public DownloadRequest() {}

    public DownloadRequest(String peerId, String fileId) {
        this.peerId = peerId;
        this.fileId = fileId;
    }

    public String getPeerId() { return peerId; }
    public void setPeerId(String peerId) { this.peerId = peerId; }
    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }
}
