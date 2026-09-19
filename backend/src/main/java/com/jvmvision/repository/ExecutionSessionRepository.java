package com.jvmvision.repository;

import com.jvmvision.model.ExecutionSession;

import java.util.List;
import java.util.Optional;

public interface ExecutionSessionRepository {
    ExecutionSession save(ExecutionSession session);
    Optional<ExecutionSession> findBySessionId(String sessionId);
    List<ExecutionSession> findAll();
    boolean deleteBySessionId(String sessionId);
}
