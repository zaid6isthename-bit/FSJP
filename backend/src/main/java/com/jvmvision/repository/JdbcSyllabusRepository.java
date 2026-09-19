package com.jvmvision.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jvmvision.model.SyllabusExperiment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcSyllabusRepository implements SyllabusRepository {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JdbcSyllabusRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SyllabusExperiment> rowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("created_at");
        LocalDateTime created = ts != null ? ts.toLocalDateTime() : LocalDateTime.now();

        List<String> conceptsList = new ArrayList<>();
        String conceptsJson = rs.getString("concepts");
        if (conceptsJson != null && !conceptsJson.trim().isEmpty()) {
            try {
                conceptsList = objectMapper.readValue(conceptsJson, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                for (String c : conceptsJson.split(",")) {
                    if (!c.trim().isEmpty()) conceptsList.add(c.trim());
                }
            }
        }

        return new SyllabusExperiment(
                rs.getString("id"),
                rs.getInt("experiment_number"),
                rs.getString("title"),
                rs.getString("category"),
                rs.getString("technology"),
                rs.getString("description"),
                rs.getString("code"),
                rs.getString("language"),
                conceptsList,
                rs.getString("difficulty"),
                rs.getString("aim"),
                rs.getString("expected_output"),
                rs.getString("route_path"),
                rs.getBoolean("is_jvm_visualizable"),
                created
        );
    };

    @Override
    public List<SyllabusExperiment> findAll() {
        return jdbcTemplate.query(
                "SELECT id, experiment_number, title, category, technology, description, code, language, " +
                        "concepts, difficulty, aim, expected_output, route_path, is_jvm_visualizable, created_at " +
                        "FROM syllabus_experiments ORDER BY experiment_number ASC",
                rowMapper
        );
    }

    @Override
    public Optional<SyllabusExperiment> findById(String id) {
        List<SyllabusExperiment> list = jdbcTemplate.query(
                "SELECT id, experiment_number, title, category, technology, description, code, language, " +
                        "concepts, difficulty, aim, expected_output, route_path, is_jvm_visualizable, created_at " +
                        "FROM syllabus_experiments WHERE id = ?",
                rowMapper,
                id
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<SyllabusExperiment> findByExperimentNumber(int number) {
        List<SyllabusExperiment> list = jdbcTemplate.query(
                "SELECT id, experiment_number, title, category, technology, description, code, language, " +
                        "concepts, difficulty, aim, expected_output, route_path, is_jvm_visualizable, created_at " +
                        "FROM syllabus_experiments WHERE experiment_number = ?",
                rowMapper,
                number
        );
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public List<SyllabusExperiment> findByCategory(String category) {
        return jdbcTemplate.query(
                "SELECT id, experiment_number, title, category, technology, description, code, language, " +
                        "concepts, difficulty, aim, expected_output, route_path, is_jvm_visualizable, created_at " +
                        "FROM syllabus_experiments WHERE UPPER(category) = UPPER(?) ORDER BY experiment_number ASC",
                rowMapper,
                category
        );
    }

    @Override
    public List<SyllabusExperiment> search(String query) {
        String pattern = "%" + query.toLowerCase() + "%";
        return jdbcTemplate.query(
                "SELECT id, experiment_number, title, category, technology, description, code, language, " +
                        "concepts, difficulty, aim, expected_output, route_path, is_jvm_visualizable, created_at " +
                        "FROM syllabus_experiments WHERE LOWER(title) LIKE ? OR LOWER(technology) LIKE ? " +
                        "OR LOWER(category) LIKE ? OR LOWER(concepts) LIKE ? OR LOWER(description) LIKE ? " +
                        "ORDER BY experiment_number ASC",
                rowMapper,
                pattern, pattern, pattern, pattern, pattern
        );
    }

    @Override
    public void save(SyllabusExperiment experiment) {
        String conceptsJson = "[]";
        try {
            conceptsJson = objectMapper.writeValueAsString(experiment.getConcepts());
        } catch (Exception ignored) {}

        jdbcTemplate.update(
                "MERGE INTO syllabus_experiments KEY(id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                experiment.getId(),
                experiment.getExperimentNumber(),
                experiment.getTitle(),
                experiment.getCategory(),
                experiment.getTechnology(),
                experiment.getDescription(),
                experiment.getCode(),
                experiment.getLanguage(),
                conceptsJson,
                experiment.getDifficulty(),
                experiment.getAim(),
                experiment.getExpectedOutput(),
                experiment.getRoutePath(),
                experiment.isJvmVisualizable(),
                Timestamp.valueOf(LocalDateTime.now())
        );
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM syllabus_experiments", Long.class);
        return count != null ? count : 0L;
    }
}
