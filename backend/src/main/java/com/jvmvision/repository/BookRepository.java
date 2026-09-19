package com.jvmvision.repository;

import com.jvmvision.model.Book;
import java.util.List;
import java.util.Optional;

public interface BookRepository {
    List<Book> findAll();
    Optional<Book> findById(Long id);
    Book save(Book book);
    Book update(Book book);
    boolean deleteById(Long id);
}
