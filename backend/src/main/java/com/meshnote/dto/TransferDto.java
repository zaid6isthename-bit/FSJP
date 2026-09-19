package com.meshnote.dto;

import com.meshnote.model.TransferDirection;
import com.meshnote.model.TransferStatus;
import java.time.LocalDateTime;

public class TransferDto {
    private String id;
    private String fileId;
    private String fileName;
    private TransferDirection direction;
    private String peerNodeId;
    private String peerName;
    private long bytesTotal;
    private long bytesTransferred;
    private double progress;
    private long speedBps;
    private String speedFormatted;
    private TransferStatus status;
    private long estimatedSecondsRemaining;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public TransferDto() {}

    public static String formatSpeed(long bytesPerSec) {
        if (bytesPerSec < 1024) return bytesPerSec + " B/s";
        if (bytesPerSec < 1024 * 1024) return String.format("%.1f KB/s", bytesPerSec / 1024.0);
        return String.format("%.2f MB/s", bytesPerSec / (1024.0 * 1024.0));
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public TransferDirection getDirection() { return direction; }
    public void setDirection(TransferDirection direction) { this.direction = direction; }
    public String getPeerNodeId() { return peerNodeId; }
    public void setPeerNodeId(String peerNodeId) { this.peerNodeId = peerNodeId; }
    public String getPeerName() { return peerName; }
    public void setPeerName(String peerName) { this.peerName = peerName; }
    public long getBytesTotal() { return bytesTotal; }
    public void setBytesTotal(long bytesTotal) { this.bytesTotal = bytesTotal; }
    public long getBytesTransferred() { return bytesTransferred; }
    public void setBytesTransferred(long bytesTransferred) { this.bytesTransferred = bytesTransferred; }
    public double getProgress() { return progress; }
    public void setProgress(double progress) { this.progress = progress; }
    public long getSpeedBps() { return speedBps; }
    public void setSpeedBps(long speedBps) { 
        this.speedBps = speedBps;
        this.speedFormatted = formatSpeed(speedBps);
    }
    public String getSpeedFormatted() { return speedFormatted; }
    public void setSpeedFormatted(String speedFormatted) { this.speedFormatted = speedFormatted; }
    public TransferStatus getStatus() { return status; }
    public void setStatus(TransferStatus status) { this.status = status; }
    public long getEstimatedSecondsRemaining() { return estimatedSecondsRemaining; }
    public void setEstimatedSecondsRemaining(long estimatedSecondsRemaining) { this.estimatedSecondsRemaining = estimatedSecondsRemaining; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
