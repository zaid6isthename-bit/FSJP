package com.jvmvision.model;

import java.time.LocalDateTime;

public class ExecutionSession {
    private Long id;
    private String sessionId;
    private String title;
    private String code;
    private String status;
    private String errorType;
    private String errorMessage;
    private int eventCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExecutionSession() {}

    public ExecutionSession(String sessionId, String title, String code, String status,
                            String errorType, String errorMessage, int eventCount) {
        this.sessionId = sessionId;
        this.title = title;
        this.code = code;
        this.status = status;
        this.errorType = errorType;
        this.errorMessage = errorMessage;
        this.eventCount = eventCount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public int getEventCount() {
        return eventCount;
    }

    public void setEventCount(int eventCount) {
        this.eventCount = eventCount;
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
}
