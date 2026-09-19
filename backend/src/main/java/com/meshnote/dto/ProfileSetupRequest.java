package com.meshnote.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ProfileSetupRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Division is required")
    private String division;

    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private int semester;

    @NotBlank(message = "Device name is required")
    private String deviceName;

    private boolean discoverable = true;
    private boolean sharingEnabled = true;

    public ProfileSetupRequest() {}

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
}
