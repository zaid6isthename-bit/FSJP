package com.jvmvision.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jvmvision.engine.trace.ExecutionEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JdbcExecutionEventRepository implements ExecutionEventRepository {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public JdbcExecutionEventRepository(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void saveEvents(String sessionId, List<ExecutionEvent> events) {
        if (events == null || events.isEmpty()) return;

        String sql = "INSERT INTO execution_events (session_id, sequence, line_number, event_type, payload_json, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        List<Object[]> batchArgs = new ArrayList<>();
        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        for (ExecutionEvent event : events) {
            try {
                String payloadJson = objectMapper.writeValueAsString(event);
                batchArgs.add(new Object[] {
                        sessionId,
                        event.getSequence(),
                        event.getLine(),
                        event.getEventType().name(),
                        payloadJson,
                        now
                });
            } catch (JsonProcessingException e) {
                // Log and continue
            }
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    @Override
    public List<ExecutionEvent> findEventsBySessionId(String sessionId) {
        String sql = "SELECT payload_json FROM execution_events WHERE session_id = ? ORDER BY sequence ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            try {
                return objectMapper.readValue(rs.getString("payload_json"), ExecutionEvent.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to deserialize execution event", e);
            }
        }, sessionId);
    }

    @Override
    public void deleteEventsBySessionId(String sessionId) {
        String sql = "DELETE FROM execution_events WHERE session_id = ?";
        jdbcTemplate.update(sql, sessionId);
    }
}
