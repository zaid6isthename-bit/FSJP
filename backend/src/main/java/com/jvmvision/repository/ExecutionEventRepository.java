package com.jvmvision.repository;

import com.jvmvision.engine.trace.ExecutionEvent;

import java.util.List;

public interface ExecutionEventRepository {
    void saveEvents(String sessionId, List<ExecutionEvent> events);
    List<ExecutionEvent> findEventsBySessionId(String sessionId);
    void deleteEventsBySessionId(String sessionId);
}
