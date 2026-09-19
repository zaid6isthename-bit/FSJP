package com.meshnote.model;

import java.time.LocalDateTime;

public class ActivityEvent {
    private Long id;
    private NetworkEventType eventType;
    private String title;
    private String description;
    private String peerId;
    private LocalDateTime createdAt;

    public ActivityEvent() {
        this.createdAt = LocalDateTime.now();
    }

    public ActivityEvent(Long id, NetworkEventType eventType, String title, String description,
                         String peerId, LocalDateTime createdAt) {
        this.id = id;
        this.eventType = eventType;
        this.title = title;
        this.description = description;
        this.peerId = peerId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NetworkEventType getEventType() {
        return eventType;
    }

    public void setEventType(NetworkEventType eventType) {
        this.eventType = eventType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPeerId() {
        return peerId;
    }

    public void setPeerId(String peerId) {
        this.peerId = peerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ActivityEvent{" +
                "id=" + id +
                ", eventType=" + eventType +
                ", title='" + title + '\'' +
                ", peerId='" + peerId + '\'' +
                '}';
    }
}
