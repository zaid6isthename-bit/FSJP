package com.jvmvision.model;

import java.time.LocalDateTime;

public class Book {
    private Long id;
    private String title;
    private String author;
    private Double price;
    private LocalDateTime createdAt;

    public Book() {}

    public Book(Long id, String title, String author, Double price, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
