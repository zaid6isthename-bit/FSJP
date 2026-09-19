package com.meshnote.model;

import java.time.LocalDateTime;

public class PeerInfo {
    private String nodeId;
    private String name;
    private String division;
    private int semester;
    private String deviceName;
    private String ipAddress;
    private int apiPort;
    private int p2pPort;
    private int sharedFileCount;
    private PeerStatus status;
    private LocalDateTime lastSeen;

    public PeerInfo() {
        this.status = PeerStatus.ONLINE;
        this.lastSeen = LocalDateTime.now();
    }

    public PeerInfo(String nodeId, String name, String division, int semester, String deviceName,
                    String ipAddress, int apiPort, int p2pPort, int sharedFileCount, PeerStatus status,
                    LocalDateTime lastSeen) {
        this.nodeId = nodeId;
        this.name = name;
        this.division = division;
        this.semester = semester;
        this.deviceName = deviceName;
        this.ipAddress = ipAddress;
        this.apiPort = apiPort;
        this.p2pPort = p2pPort;
        this.sharedFileCount = sharedFileCount;
        this.status = status;
        this.lastSeen = lastSeen;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public int getApiPort() {
        return apiPort;
    }

    public void setApiPort(int apiPort) {
        this.apiPort = apiPort;
    }

    public int getP2pPort() {
        return p2pPort;
    }

    public void setP2pPort(int p2pPort) {
        this.p2pPort = p2pPort;
    }

    public int getSharedFileCount() {
        return sharedFileCount;
    }

    public void setSharedFileCount(int sharedFileCount) {
        this.sharedFileCount = sharedFileCount;
    }

    public PeerStatus getStatus() {
        return status;
    }

    public void setStatus(PeerStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }

    @Override
    public String toString() {
        return "PeerInfo{" +
                "nodeId='" + nodeId + '\'' +
                ", name='" + name + '\'' +
                ", deviceName='" + deviceName + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", p2pPort=" + p2pPort +
                ", status=" + status +
                ", sharedFiles=" + sharedFileCount +
                '}';
    }
}
