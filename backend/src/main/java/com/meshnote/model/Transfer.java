package com.meshnote.model;

import java.time.LocalDateTime;

public class Transfer {
    private String id;
    private String fileId;
    private String fileName;
    private TransferDirection direction;
    private String peerNodeId;
    private String peerName;
    private long bytesTotal;
    private long bytesTransferred;
    private long speedBps;
    private TransferStatus status;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public Transfer() {
        this.status = TransferStatus.QUEUED;
        this.bytesTransferred = 0;
        this.speedBps = 0;
        this.startedAt = LocalDateTime.now();
    }

    public Transfer(String id, String fileId, String fileName, TransferDirection direction,
                    String peerNodeId, String peerName, long bytesTotal, long bytesTransferred,
                    long speedBps, TransferStatus status, String errorMessage,
                    LocalDateTime startedAt, LocalDateTime completedAt) {
        this.id = id;
        this.fileId = fileId;
        this.fileName = fileName;
        this.direction = direction;
        this.peerNodeId = peerNodeId;
        this.peerName = peerName;
        this.bytesTotal = bytesTotal;
        this.bytesTransferred = bytesTransferred;
        this.speedBps = speedBps;
        this.status = status;
        this.errorMessage = errorMessage;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public double getProgressPercentage() {
        if (bytesTotal <= 0) return 0.0;
        double progress = ((double) bytesTransferred / bytesTotal) * 100.0;
        return Math.min(100.0, Math.max(0.0, progress));
    }

    public long getEstimatedSecondsRemaining() {
        if (speedBps <= 0 || bytesTotal <= bytesTransferred) return 0;
        return (bytesTotal - bytesTransferred) / speedBps;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public TransferDirection getDirection() {
        return direction;
    }

    public void setDirection(TransferDirection direction) {
        this.direction = direction;
    }

    public String getPeerNodeId() {
        return peerNodeId;
    }

    public void setPeerNodeId(String peerNodeId) {
        this.peerNodeId = peerNodeId;
    }

    public String getPeerName() {
        return peerName;
    }

    public void setPeerName(String peerName) {
        this.peerName = peerName;
    }

    public long getBytesTotal() {
        return bytesTotal;
    }

    public void setBytesTotal(long bytesTotal) {
        this.bytesTotal = bytesTotal;
    }

    public long getBytesTransferred() {
        return bytesTransferred;
    }

    public void setBytesTransferred(long bytesTransferred) {
        this.bytesTransferred = bytesTransferred;
    }

    public long getSpeedBps() {
        return speedBps;
    }

    public void setSpeedBps(long speedBps) {
        this.speedBps = speedBps;
    }

    public TransferStatus getStatus() {
        return status;
    }

    public void setStatus(TransferStatus status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    @Override
    public String toString() {
        return "Transfer{" +
                "id='" + id + '\'' +
                ", fileName='" + fileName + '\'' +
                ", direction=" + direction +
                ", status=" + status +
                ", progress=" + String.format("%.1f%%", getProgressPercentage()) +
                '}';
    }
}
