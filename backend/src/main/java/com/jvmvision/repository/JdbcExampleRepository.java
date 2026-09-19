package com.jvmvision.repository;

import com.jvmvision.model.Example;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcExampleRepository implements ExampleRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Example> rowMapper = (rs, rowNum) -> {
        Example ex = new Example();
        ex.setId(rs.getString("id"));
        ex.setTitle(rs.getString("title"));
        ex.setCategory(rs.getString("category"));
        ex.setDescription(rs.getString("description"));
        ex.setCode(rs.getString("code"));
        ex.setDifficulty(rs.getString("difficulty"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) ex.setCreatedAt(createdAt.toLocalDateTime());

        return ex;
    };

    public JdbcExampleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Example> findAll() {
        String sql = "SELECT * FROM examples ORDER BY id ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<Example> findById(String id) {
        String sql = "SELECT * FROM examples WHERE id = ?";
        List<Example> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Example save(Example example) {
        String sql = "INSERT INTO examples (id, title, category, description, code, difficulty, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                example.getId(),
                example.getTitle(),
                example.getCategory(),
                example.getDescription(),
                example.getCode(),
                example.getDifficulty(),
                Timestamp.valueOf(example.getCreatedAt() != null ? example.getCreatedAt() : LocalDateTime.now())
        );
        return example;
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM examples", Long.class);
        return count != null ? count : 0;
    }
}
