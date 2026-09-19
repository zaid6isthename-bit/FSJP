package com.meshnote.dto;

import java.time.LocalDateTime;

public class FileDto {
    private String id;
    private String name;
    private String mimeType;
    private String type; // e.g. "PDF", "PPTX", "DOCX", "ZIP", "IMG"
    private long sizeBytes;
    private String sizeFormatted;
    private String subject;
    private String module;
    private int semester;
    private String description;
    private String ownerName;
    private String peerId;
    private boolean available;
    private boolean shared;
    private int accessCount;
    private LocalDateTime createdAt;

    public FileDto() {}

    public static String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }

    public static String determineType(String filename, String mimeType) {
        if (filename == null) return "FILE";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf")) return "PDF";
        if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "PPTX";
        if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "DOCX";
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "IMAGE";
        if (lower.endsWith(".zip") || lower.endsWith(".rar") || lower.endsWith(".tar.gz")) return "ARCHIVE";
        return "DOC";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { 
        this.sizeBytes = sizeBytes;
        this.sizeFormatted = formatBytes(sizeBytes);
    }
    public String getSizeFormatted() { return sizeFormatted; }
    public void setSizeFormatted(String sizeFormatted) { this.sizeFormatted = sizeFormatted; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getPeerId() { return peerId; }
    public void setPeerId(String peerId) { this.peerId = peerId; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public boolean isShared() { return shared; }
    public void setShared(boolean shared) { this.shared = shared; }
    public int getAccessCount() { return accessCount; }
    public void setAccessCount(int accessCount) { this.accessCount = accessCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
