package com.meshnote.repository;

import com.meshnote.model.SharedFile;
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
public class JdbcSharedFileRepository implements SharedFileRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcSharedFileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SharedFile> fileRowMapper = new RowMapper<>() {
        @Override
        public SharedFile mapRow(ResultSet rs, int rowNum) throws SQLException {
            SharedFile file = new SharedFile();
            file.setId(rs.getString("id"));
            file.setOriginalName(rs.getString("original_name"));
            file.setStoredName(rs.getString("stored_name"));
            file.setMimeType(rs.getString("mime_type"));
            file.setSizeBytes(rs.getLong("size_bytes"));
            file.setSubject(rs.getString("subject"));
            file.setModule(rs.getString("module"));
            file.setSemester(rs.getInt("semester"));
            file.setDescription(rs.getString("description"));
            file.setOwnerUserId(rs.getString("owner_user_id"));
            file.setShared(rs.getBoolean("shared"));
            file.setAccessCount(rs.getInt("access_count"));

            Timestamp createdTs = rs.getTimestamp("created_at");
            if (createdTs != null) file.setCreatedAt(createdTs.toLocalDateTime());

            Timestamp updatedTs = rs.getTimestamp("updated_at");
            if (updatedTs != null) file.setUpdatedAt(updatedTs.toLocalDateTime());

            return file;
        }
    };

    @Override
    public Optional<SharedFile> findById(String id) {
        String sql = "SELECT * FROM shared_files WHERE id = ?";
        List<SharedFile> results = jdbcTemplate.query(sql, fileRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public List<SharedFile> findAll() {
        String sql = "SELECT * FROM shared_files ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, fileRowMapper);
    }

    @Override
    public List<SharedFile> findAllShared() {
        String sql = "SELECT * FROM shared_files WHERE shared = TRUE ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, fileRowMapper);
    }

    @Override
    public SharedFile save(SharedFile file) {
        if (file.getCreatedAt() == null) file.setCreatedAt(LocalDateTime.now());
        file.setUpdatedAt(LocalDateTime.now());

        String sql = "INSERT INTO shared_files (id, original_name, stored_name, mime_type, size_bytes, " +
                     "subject, module, semester, description, owner_user_id, shared, access_count, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                file.getId(),
                file.getOriginalName(),
                file.getStoredName(),
                file.getMimeType(),
                file.getSizeBytes(),
                file.getSubject(),
                file.getModule(),
                file.getSemester(),
                file.getDescription(),
                file.getOwnerUserId(),
                file.isShared(),
                file.getAccessCount(),
                Timestamp.valueOf(file.getCreatedAt()),
                Timestamp.valueOf(file.getUpdatedAt()));
        return file;
    }

    @Override
    public SharedFile update(SharedFile file) {
        file.setUpdatedAt(LocalDateTime.now());
        String sql = "UPDATE shared_files SET original_name = ?, mime_type = ?, size_bytes = ?, " +
                     "subject = ?, module = ?, semester = ?, description = ?, shared = ?, access_count = ?, updated_at = ? " +
                     "WHERE id = ?";
        jdbcTemplate.update(sql,
                file.getOriginalName(),
                file.getMimeType(),
                file.getSizeBytes(),
                file.getSubject(),
                file.getModule(),
                file.getSemester(),
                file.getDescription(),
                file.isShared(),
                file.getAccessCount(),
                Timestamp.valueOf(file.getUpdatedAt()),
                file.getId());
        return file;
    }

    @Override
    public void deleteById(String id) {
        String sql = "DELETE FROM shared_files WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public int countShared() {
        String sql = "SELECT COUNT(*) FROM shared_files WHERE shared = TRUE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    @Override
    public void incrementAccessCount(String id) {
        String sql = "UPDATE shared_files SET access_count = access_count + 1, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    @Override
    public List<SharedFile> search(String query) {
        String pattern = "%" + query.toLowerCase() + "%";
        String sql = "SELECT * FROM shared_files WHERE shared = TRUE AND (" +
                     "LOWER(original_name) LIKE ? OR " +
                     "LOWER(subject) LIKE ? OR " +
                     "LOWER(module) LIKE ? OR " +
                     "LOWER(description) LIKE ?) " +
                     "ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, fileRowMapper, pattern, pattern, pattern, pattern);
    }
}
