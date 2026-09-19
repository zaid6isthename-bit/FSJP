package com.meshnote.repository;

import com.meshnote.model.UserProfile;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<UserProfile> userRowMapper = new RowMapper<>() {
        @Override
        public UserProfile mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserProfile user = new UserProfile();
            user.setId(rs.getString("id"));
            user.setName(rs.getString("name"));
            user.setDivision(rs.getString("division"));
            user.setSemester(rs.getInt("semester"));
            user.setDeviceName(rs.getString("device_name"));
            user.setDiscoverable(rs.getBoolean("discoverable"));
            user.setSharingEnabled(rs.getBoolean("sharing_enabled"));

            Timestamp createdTs = rs.getTimestamp("created_at");
            if (createdTs != null) user.setCreatedAt(createdTs.toLocalDateTime());

            Timestamp updatedTs = rs.getTimestamp("updated_at");
            if (updatedTs != null) user.setUpdatedAt(updatedTs.toLocalDateTime());

            return user;
        }
    };

    @Override
    public Optional<UserProfile> findProfile() {
        String sql = "SELECT id, name, division, semester, device_name, discoverable, sharing_enabled, created_at, updated_at FROM users LIMIT 1";
        List<UserProfile> results = jdbcTemplate.query(sql, userRowMapper);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public UserProfile save(UserProfile profile) {
        if (profile.getCreatedAt() == null) profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        String sql = "INSERT INTO users (id, name, division, semester, device_name, discoverable, sharing_enabled, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                profile.getId(),
                profile.getName(),
                profile.getDivision(),
                profile.getSemester(),
                profile.getDeviceName(),
                profile.isDiscoverable(),
                profile.isSharingEnabled(),
                Timestamp.valueOf(profile.getCreatedAt()),
                Timestamp.valueOf(profile.getUpdatedAt()));
        return profile;
    }

    @Override
    public UserProfile update(UserProfile profile) {
        profile.setUpdatedAt(LocalDateTime.now());
        String sql = "UPDATE users SET name = ?, division = ?, semester = ?, device_name = ?, " +
                     "discoverable = ?, sharing_enabled = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                profile.getName(),
                profile.getDivision(),
                profile.getSemester(),
                profile.getDeviceName(),
                profile.isDiscoverable(),
                profile.isSharingEnabled(),
                Timestamp.valueOf(profile.getUpdatedAt()),
                profile.getId());
        return profile;
    }
}
