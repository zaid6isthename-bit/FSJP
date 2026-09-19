package com.jvmvision.service;

import com.jvmvision.model.ExecutionSession;
import com.jvmvision.repository.ExecutionEventRepository;
import com.jvmvision.repository.ExecutionSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    private final ExecutionSessionRepository sessionRepository;
    private final ExecutionEventRepository eventRepository;

    public SessionService(ExecutionSessionRepository sessionRepository, ExecutionEventRepository eventRepository) {
        this.sessionRepository = sessionRepository;
        this.eventRepository = eventRepository;
    }

    public List<ExecutionSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Optional<ExecutionSession> getSessionById(String sessionId) {
        return sessionRepository.findBySessionId(sessionId);
    }

    public boolean deleteSession(String sessionId) {
        eventRepository.deleteEventsBySessionId(sessionId);
        return sessionRepository.deleteBySessionId(sessionId);
    }
}
