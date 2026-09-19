package com.jvmvision.engine.trace;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ExecutionTrace {
    private final String sessionId;
    private final String status; // "COMPLETED", "FAILED"
    private final List<ExecutionEvent> events;
    private final int totalEvents;
    private final String errorType;
    private final String errorMessage;
    private final Integer errorLine;
    private final Map<String, Object> failureForensics;

    public ExecutionTrace(String sessionId, String status, List<ExecutionEvent> events,
                          String errorType, String errorMessage, Integer errorLine,
                          Map<String, Object> failureForensics) {
        this.sessionId = sessionId;
        this.status = status;
        this.events = events != null ? events : new ArrayList<>();
        this.totalEvents = this.events.size();
        this.errorType = errorType;
        this.errorMessage = errorMessage;
        this.errorLine = errorLine;
        this.failureForensics = failureForensics;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getStatus() {
        return status;
    }

    public List<ExecutionEvent> getEvents() {
        return events;
    }

    public int getTotalEvents() {
        return totalEvents;
    }

    public String getErrorType() {
        return errorType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Integer getErrorLine() {
        return errorLine;
    }

    public Map<String, Object> getFailureForensics() {
        return failureForensics;
    }
}
