package com.meshnote.dto;

import java.time.LocalDateTime;

public class ProfileDto {
    private String id;
    private String name;
    private String division;
    private int semester;
    private String deviceName;
    private boolean discoverable;
    private boolean sharingEnabled;
    private LocalDateTime createdAt;

    public ProfileDto() {}

    public ProfileDto(String id, String name, String division, int semester, String deviceName,
                      boolean discoverable, boolean sharingEnabled, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.division = division;
        this.semester = semester;
        this.deviceName = deviceName;
        this.discoverable = discoverable;
        this.sharingEnabled = sharingEnabled;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    public boolean isDiscoverable() { return discoverable; }
    public void setDiscoverable(boolean discoverable) { this.discoverable = discoverable; }
    public boolean isSharingEnabled() { return sharingEnabled; }
    public void setSharingEnabled(boolean sharingEnabled) { this.sharingEnabled = sharingEnabled; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
