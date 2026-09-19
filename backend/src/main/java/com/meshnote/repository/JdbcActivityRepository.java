package com.meshnote.repository;

import com.meshnote.model.ActivityEvent;
import com.meshnote.model.NetworkEventType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class JdbcActivityRepository implements ActivityRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcActivityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ActivityEvent> activityRowMapper = new RowMapper<>() {
        @Override
        public ActivityEvent mapRow(ResultSet rs, int rowNum) throws SQLException {
            ActivityEvent event = new ActivityEvent();
            event.setId(rs.getLong("id"));
            event.setEventType(NetworkEventType.valueOf(rs.getString("event_type")));
            event.setTitle(rs.getString("title"));
            event.setDescription(rs.getString("description"));
            event.setPeerId(rs.getString("peer_id"));

            Timestamp createdTs = rs.getTimestamp("created_at");
            if (createdTs != null) event.setCreatedAt(createdTs.toLocalDateTime());

            return event;
        }
    };

    @Override
    public List<ActivityEvent> findAll(int limit) {
        String sql = "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, activityRowMapper, limit);
    }

    @Override
    public ActivityEvent save(ActivityEvent event) {
        if (event.getCreatedAt() == null) event.setCreatedAt(LocalDateTime.now());

        String sql = "INSERT INTO activity_log (event_type, title, description, peer_id, created_at) " +
                     "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                event.getEventType().name(),
                event.getTitle(),
                event.getDescription(),
                event.getPeerId(),
                Timestamp.valueOf(event.getCreatedAt()));
        return event;
    }
}
