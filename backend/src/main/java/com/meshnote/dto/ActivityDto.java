package com.meshnote.dto;

import com.meshnote.model.NetworkEventType;
import java.time.LocalDateTime;

public class ActivityDto {
    private Long id;
    private NetworkEventType type;
    private String title;
    private String description;
    private String peerId;
    private LocalDateTime timestamp;

    public ActivityDto() {}

    public ActivityDto(Long id, NetworkEventType type, String title, String description,
                       String peerId, LocalDateTime timestamp) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.peerId = peerId;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public NetworkEventType getType() { return type; }
    public void setType(NetworkEventType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPeerId() { return peerId; }
    public void setPeerId(String peerId) { this.peerId = peerId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
