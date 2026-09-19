package com.jvmvision.repository;

import com.jvmvision.model.Book;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcBookRepository implements BookRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Book> rowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("created_at");
        LocalDateTime created = ts != null ? ts.toLocalDateTime() : LocalDateTime.now();
        return new Book(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getDouble("price"),
                created
        );
    };

    public JdbcBookRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Book> findAll() {
        return jdbcTemplate.query("SELECT id, title, author, price, created_at FROM books ORDER BY id ASC", rowMapper);
    }

    @Override
    public Optional<Book> findById(Long id) {
        List<Book> books = jdbcTemplate.query("SELECT id, title, author, price, created_at FROM books WHERE id = ?", rowMapper, id);
        return books.isEmpty() ? Optional.empty() : Optional.of(books.get(0));
    }

    @Override
    public Book save(Book book) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO books (title, author, price, created_at) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setDouble(3, book.getPrice());
            ps.setTimestamp(4, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            book.setId(key.longValue());
        }
        return book;
    }

    @Override
    public Book update(Book book) {
        jdbcTemplate.update(
                "UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?",
                book.getTitle(), book.getAuthor(), book.getPrice(), book.getId()
        );
        return book;
    }

    @Override
    public boolean deleteById(Long id) {
        int rows = jdbcTemplate.update("DELETE FROM books WHERE id = ?", id);
        return rows > 0;
    }
}
