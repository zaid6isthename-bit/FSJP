package com.meshnote.dto;

public class DashboardStatsDto {
    private int nearbyPeers;
    private int activePeers;
    private int availableFiles;
    private int sharedFiles;
    private int activeTransfers;
    private boolean networkConnected;

    public DashboardStatsDto() {}

    public DashboardStatsDto(int nearbyPeers, int activePeers, int availableFiles,
                             int sharedFiles, int activeTransfers, boolean networkConnected) {
        this.nearbyPeers = nearbyPeers;
        this.activePeers = activePeers;
        this.availableFiles = availableFiles;
        this.sharedFiles = sharedFiles;
        this.activeTransfers = activeTransfers;
        this.networkConnected = networkConnected;
    }

    public int getNearbyPeers() { return nearbyPeers; }
    public void setNearbyPeers(int nearbyPeers) { this.nearbyPeers = nearbyPeers; }
    public int getActivePeers() { return activePeers; }
    public void setActivePeers(int activePeers) { this.activePeers = activePeers; }
    public int getAvailableFiles() { return availableFiles; }
    public void setAvailableFiles(int availableFiles) { this.availableFiles = availableFiles; }
    public int getSharedFiles() { return sharedFiles; }
    public void setSharedFiles(int sharedFiles) { this.sharedFiles = sharedFiles; }
    public int getActiveTransfers() { return activeTransfers; }
    public void setActiveTransfers(int activeTransfers) { this.activeTransfers = activeTransfers; }
    public boolean isNetworkConnected() { return networkConnected; }
    public void setNetworkConnected(boolean networkConnected) { this.networkConnected = networkConnected; }
}
