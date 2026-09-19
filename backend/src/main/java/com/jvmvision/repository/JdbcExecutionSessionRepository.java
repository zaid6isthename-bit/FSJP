package com.jvmvision.repository;

import com.jvmvision.model.ExecutionSession;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcExecutionSessionRepository implements ExecutionSessionRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ExecutionSession> rowMapper = (rs, rowNum) -> {
        ExecutionSession session = new ExecutionSession();
        session.setId(rs.getLong("id"));
        session.setSessionId(rs.getString("session_id"));
        session.setTitle(rs.getString("title"));
        session.setCode(rs.getString("code"));
        session.setStatus(rs.getString("status"));
        session.setErrorType(rs.getString("error_type"));
        session.setErrorMessage(rs.getString("error_message"));
        session.setEventCount(rs.getInt("event_count"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) session.setCreatedAt(createdAt.toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) session.setUpdatedAt(updatedAt.toLocalDateTime());

        return session;
    };

    public JdbcExecutionSessionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public ExecutionSession save(ExecutionSession session) {
        String sql = "INSERT INTO execution_sessions (session_id, title, code, status, error_type, error_message, event_count, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                session.getSessionId(),
                session.getTitle(),
                session.getCode(),
                session.getStatus(),
                session.getErrorType(),
                session.getErrorMessage(),
                session.getEventCount(),
                Timestamp.valueOf(session.getCreatedAt() != null ? session.getCreatedAt() : LocalDateTime.now()),
                Timestamp.valueOf(session.getUpdatedAt() != null ? session.getUpdatedAt() : LocalDateTime.now())
        );
        return session;
    }

    @Override
    public Optional<ExecutionSession> findBySessionId(String sessionId) {
        String sql = "SELECT * FROM execution_sessions WHERE session_id = ?";
        List<ExecutionSession> list = jdbcTemplate.query(sql, rowMapper, sessionId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public List<ExecutionSession> findAll() {
        String sql = "SELECT * FROM execution_sessions ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public boolean deleteBySessionId(String sessionId) {
        String sql = "DELETE FROM execution_sessions WHERE session_id = ?";
        int rows = jdbcTemplate.update(sql, sessionId);
        return rows > 0;
    }
}
