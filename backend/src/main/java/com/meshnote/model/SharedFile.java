package com.meshnote.model;

import java.time.LocalDateTime;

public class SharedFile {
    private String id;
    private String originalName;
    private String storedName;
    private String mimeType;
    private long sizeBytes;
    private String subject;
    private String module;
    private int semester;
    private String description;
    private String ownerUserId;
    private boolean shared;
    private int accessCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SharedFile() {
        this.shared = true;
        this.accessCount = 0;
    }

    public SharedFile(String id, String originalName, String storedName, String mimeType, long sizeBytes,
                      String subject, String module, int semester, String description, String ownerUserId,
                      boolean shared, int accessCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.originalName = originalName;
        this.storedName = storedName;
        this.mimeType = mimeType;
        this.sizeBytes = sizeBytes;
        this.subject = subject;
        this.module = module;
        this.semester = semester;
        this.description = description;
        this.ownerUserId = ownerUserId;
        this.shared = shared;
        this.accessCount = accessCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getStoredName() {
        return storedName;
    }

    public void setStoredName(String storedName) {
        this.storedName = storedName;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    public int getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(int accessCount) {
        this.accessCount = accessCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "SharedFile{" +
                "id='" + id + '\'' +
                ", originalName='" + originalName + '\'' +
                ", subject='" + subject + '\'' +
                ", module='" + module + '\'' +
                ", sizeBytes=" + sizeBytes +
                ", shared=" + shared +
                '}';
    }
}
