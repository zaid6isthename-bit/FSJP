package com.meshnote.dto;

import com.meshnote.model.PeerStatus;
import java.time.LocalDateTime;

public class PeerDto {
    private String id;
    private String name;
    private String division;
    private int semester;
    private String deviceName;
    private String ipAddress;
    private int apiPort;
    private int p2pPort;
    private PeerStatus status;
    private int sharedFileCount;
    private LocalDateTime lastSeen;
    private String lastSeenText;

    public PeerDto() {}

    public PeerDto(String id, String name, String division, int semester, String deviceName,
                   String ipAddress, int apiPort, int p2pPort, PeerStatus status,
                   int sharedFileCount, LocalDateTime lastSeen, String lastSeenText) {
        this.id = id;
        this.name = name;
        this.division = division;
        this.semester = semester;
        this.deviceName = deviceName;
        this.ipAddress = ipAddress;
        this.apiPort = apiPort;
        this.p2pPort = p2pPort;
        this.status = status;
        this.sharedFileCount = sharedFileCount;
        this.lastSeen = lastSeen;
        this.lastSeenText = lastSeenText;
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
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public int getApiPort() { return apiPort; }
    public void setApiPort(int apiPort) { this.apiPort = apiPort; }
    public int getP2pPort() { return p2pPort; }
    public void setP2pPort(int p2pPort) { this.p2pPort = p2pPort; }
    public PeerStatus getStatus() { return status; }
    public void setStatus(PeerStatus status) { this.status = status; }
    public int getSharedFileCount() { return sharedFileCount; }
    public void setSharedFileCount(int sharedFileCount) { this.sharedFileCount = sharedFileCount; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
    public String getLastSeenText() { return lastSeenText; }
    public void setLastSeenText(String lastSeenText) { this.lastSeenText = lastSeenText; }
}
