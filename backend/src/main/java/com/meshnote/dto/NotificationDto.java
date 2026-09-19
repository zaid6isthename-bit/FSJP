package com.meshnote.dto;

import com.meshnote.model.NotificationType;
import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private NotificationType type;
    private String title;
    private String description;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(Long id, NotificationType type, String title, String description,
                           boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
