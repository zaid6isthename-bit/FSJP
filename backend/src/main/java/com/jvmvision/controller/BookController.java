package com.jvmvision.controller;

import com.jvmvision.dto.ApiResponse;
import com.jvmvision.model.Book;
import com.jvmvision.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Book>>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(ApiResponse.success(books, "Retrieved " + books.size() + " books successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBookById(@PathVariable Long id) {
        Optional<Book> opt = bookService.getBookById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(opt.get(), "Book retrieved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Book not found with id: " + id, "NOT_FOUND"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Book>> createBook(@RequestBody Book book) {
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Book title cannot be empty", "VALIDATION_ERROR"));
        }
        if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Book author cannot be empty", "VALIDATION_ERROR"));
        }
        if (book.getPrice() == null || book.getPrice() < 0) {
            book.setPrice(0.0);
        }
        Book created = bookService.createBook(book);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Book created successfully."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Optional<Book> updated = bookService.updateBook(id, book);
        if (updated.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(updated.get(), "Book updated successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Book not found with id: " + id, "NOT_FOUND"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        boolean deleted = bookService.deleteBook(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success(null, "Book deleted successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Book not found with id: " + id, "NOT_FOUND"));
        }
    }
}
