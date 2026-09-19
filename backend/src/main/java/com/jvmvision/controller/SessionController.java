package com.jvmvision.controller;

import com.jvmvision.dto.ApiResponse;
import com.jvmvision.model.ExecutionSession;
import com.jvmvision.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExecutionSession>>> getAllSessions() {
        List<ExecutionSession> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(ApiResponse.ok(sessions, "Sessions retrieved"));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<ExecutionSession>> getSessionById(@PathVariable String sessionId) {
        Optional<ExecutionSession> session = sessionService.getSessionById(sessionId);
        return session.map(s -> ResponseEntity.ok(ApiResponse.ok(s, "Session retrieved")))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Session not found", "NOT_FOUND")));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable String sessionId) {
        boolean deleted = sessionService.deleteSession(sessionId);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.ok(null, "Session deleted"));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error("Session not found", "NOT_FOUND"));
        }
    }
}
