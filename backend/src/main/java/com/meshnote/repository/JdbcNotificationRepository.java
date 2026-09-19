package com.meshnote.repository;

import com.meshnote.model.Notification;
import com.meshnote.model.NotificationType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class JdbcNotificationRepository implements NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcNotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> notificationRowMapper = new RowMapper<>() {
        @Override
        public Notification mapRow(ResultSet rs, int rowNum) throws SQLException {
            Notification notification = new Notification();
            notification.setId(rs.getLong("id"));
            notification.setType(NotificationType.valueOf(rs.getString("type")));
            notification.setTitle(rs.getString("title"));
            notification.setDescription(rs.getString("description"));
            notification.setRead(rs.getBoolean("read"));

            Timestamp createdTs = rs.getTimestamp("created_at");
            if (createdTs != null) notification.setCreatedAt(createdTs.toLocalDateTime());

            return notification;
        }
    };

    @Override
    public List<Notification> findAll() {
        String sql = "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    @Override
    public List<Notification> findUnread() {
        String sql = "SELECT * FROM notifications WHERE read = FALSE ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    @Override
    public Notification save(Notification notification) {
        if (notification.getCreatedAt() == null) notification.setCreatedAt(LocalDateTime.now());

        String sql = "INSERT INTO notifications (type, title, description, read, created_at) " +
                     "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                notification.getType().name(),
                notification.getTitle(),
                notification.getDescription(),
                notification.isRead(),
                Timestamp.valueOf(notification.getCreatedAt()));
        return notification;
    }

    @Override
    public void markAsRead(Long id) {
        String sql = "UPDATE notifications SET read = TRUE WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void markAllAsRead() {
        String sql = "UPDATE notifications SET read = TRUE WHERE read = FALSE";
        jdbcTemplate.update(sql);
    }
}
