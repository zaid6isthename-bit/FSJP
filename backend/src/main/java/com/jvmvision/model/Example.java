package com.jvmvision.model;

import java.time.LocalDateTime;

public class Example {
    private String id;
    private String title;
    private String category;
    private String description;
    private String code;
    private String difficulty;
    private LocalDateTime createdAt;

    public Example() {}

    public Example(String id, String title, String category, String description, String code, String difficulty) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.code = code;
        this.difficulty = difficulty;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
