package com.meshnote.dto;

public class NetworkStatusDto {
    private boolean connected;
    private String networkName;
    private String localIp;
    private int apiPort;
    private int p2pPort;
    private int discoveryPort;
    private int peerCount;
    private boolean discoverable;
    private boolean sharingEnabled;
    private boolean discoveryActive;
    private String nodeId;
    private String lastHeartbeat;

    public NetworkStatusDto() {}

    public boolean isConnected() { return connected; }
    public void setConnected(boolean connected) { this.connected = connected; }
    public String getNetworkName() { return networkName; }
    public void setNetworkName(String networkName) { this.networkName = networkName; }
    public String getLocalIp() { return localIp; }
    public void setLocalIp(String localIp) { this.localIp = localIp; }
    public int getApiPort() { return apiPort; }
    public void setApiPort(int apiPort) { this.apiPort = apiPort; }
    public int getP2pPort() { return p2pPort; }
    public void setP2pPort(int p2pPort) { this.p2pPort = p2pPort; }
    public int getDiscoveryPort() { return discoveryPort; }
    public void setDiscoveryPort(int discoveryPort) { this.discoveryPort = discoveryPort; }
    public int getPeerCount() { return peerCount; }
    public void setPeerCount(int peerCount) { this.peerCount = peerCount; }
    public boolean isDiscoverable() { return discoverable; }
    public void setDiscoverable(boolean discoverable) { this.discoverable = discoverable; }
    public boolean isSharingEnabled() { return sharingEnabled; }
    public void setSharingEnabled(boolean sharingEnabled) { this.sharingEnabled = sharingEnabled; }
    public boolean isDiscoveryActive() { return discoveryActive; }
    public void setDiscoveryActive(boolean discoveryActive) { this.discoveryActive = discoveryActive; }
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }
    public String getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(String lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }
}
