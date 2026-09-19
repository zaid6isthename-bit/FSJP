package com.meshnote.repository;

import com.meshnote.model.Transfer;
import com.meshnote.model.TransferDirection;
import com.meshnote.model.TransferStatus;
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
public class JdbcTransferRepository implements TransferRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcTransferRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Transfer> transferRowMapper = new RowMapper<>() {
        @Override
        public Transfer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Transfer transfer = new Transfer();
            transfer.setId(rs.getString("id"));
            transfer.setFileId(rs.getString("file_id"));
            transfer.setFileName(rs.getString("file_name"));
            transfer.setDirection(TransferDirection.valueOf(rs.getString("direction")));
            transfer.setPeerNodeId(rs.getString("peer_node_id"));
            transfer.setPeerName(rs.getString("peer_name"));
            transfer.setBytesTotal(rs.getLong("bytes_total"));
            transfer.setBytesTransferred(rs.getLong("bytes_transferred"));
            transfer.setSpeedBps(rs.getLong("speed_bps"));
            transfer.setStatus(TransferStatus.valueOf(rs.getString("status")));
            transfer.setErrorMessage(rs.getString("error_message"));

            Timestamp startedTs = rs.getTimestamp("started_at");
            if (startedTs != null) transfer.setStartedAt(startedTs.toLocalDateTime());

            Timestamp completedTs = rs.getTimestamp("completed_at");
            if (completedTs != null) transfer.setCompletedAt(completedTs.toLocalDateTime());

            return transfer;
        }
    };

    @Override
    public Optional<Transfer> findById(String id) {
        String sql = "SELECT * FROM transfers WHERE id = ?";
        List<Transfer> results = jdbcTemplate.query(sql, transferRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public List<Transfer> findAll() {
        String sql = "SELECT * FROM transfers ORDER BY started_at DESC";
        return jdbcTemplate.query(sql, transferRowMapper);
    }

    @Override
    public List<Transfer> findByStatus(TransferStatus status) {
        String sql = "SELECT * FROM transfers WHERE status = ? ORDER BY started_at DESC";
        return jdbcTemplate.query(sql, transferRowMapper, status.name());
    }

    @Override
    public List<Transfer> findByDirection(TransferDirection direction) {
        String sql = "SELECT * FROM transfers WHERE direction = ? ORDER BY started_at DESC";
        return jdbcTemplate.query(sql, transferRowMapper, direction.name());
    }

    @Override
    public Transfer save(Transfer transfer) {
        if (transfer.getStartedAt() == null) transfer.setStartedAt(LocalDateTime.now());

        String sql = "INSERT INTO transfers (id, file_id, file_name, direction, peer_node_id, peer_name, " +
                     "bytes_total, bytes_transferred, speed_bps, status, error_message, started_at, completed_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                transfer.getId(),
                transfer.getFileId(),
                transfer.getFileName(),
                transfer.getDirection().name(),
                transfer.getPeerNodeId(),
                transfer.getPeerName(),
                transfer.getBytesTotal(),
                transfer.getBytesTransferred(),
                transfer.getSpeedBps(),
                transfer.getStatus().name(),
                transfer.getErrorMessage(),
                Timestamp.valueOf(transfer.getStartedAt()),
                transfer.getCompletedAt() != null ? Timestamp.valueOf(transfer.getCompletedAt()) : null);
        return transfer;
    }

    @Override
    public Transfer update(Transfer transfer) {
        String sql = "UPDATE transfers SET bytes_transferred = ?, speed_bps = ?, status = ?, " +
                     "error_message = ?, completed_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                transfer.getBytesTransferred(),
                transfer.getSpeedBps(),
                transfer.getStatus().name(),
                transfer.getErrorMessage(),
                transfer.getCompletedAt() != null ? Timestamp.valueOf(transfer.getCompletedAt()) : null,
                transfer.getId());
        return transfer;
    }

    @Override
    public int countActive() {
        String sql = "SELECT COUNT(*) FROM transfers WHERE status IN ('QUEUED', 'CONNECTING', 'DOWNLOADING', 'UPLOADING')";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    @Override
    public int countCompleted() {
        String sql = "SELECT COUNT(*) FROM transfers WHERE status = 'COMPLETED'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }
}
