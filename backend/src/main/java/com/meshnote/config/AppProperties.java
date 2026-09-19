package com.meshnote.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "mesh")
public class AppProperties {
    private int discoveryPort = 47777;
    private int p2pPort = 49000;
    private String sharedDirectory = "./data/shared";
    private String downloadDirectory = "./data/downloads";
    private long discoveryInterval = 5000;
    private long peerTimeout = 15000;
    private long maxFileSize = 524288000; // 500 MB
    private boolean debug = false;

    public int getDiscoveryPort() { return discoveryPort; }
    public void setDiscoveryPort(int discoveryPort) { this.discoveryPort = discoveryPort; }
    public int getP2pPort() { return p2pPort; }
    public void setP2pPort(int p2pPort) { this.p2pPort = p2pPort; }
    public String getSharedDirectory() { return sharedDirectory; }
    public void setSharedDirectory(String sharedDirectory) { this.sharedDirectory = sharedDirectory; }
    public String getDownloadDirectory() { return downloadDirectory; }
    public void setDownloadDirectory(String downloadDirectory) { this.downloadDirectory = downloadDirectory; }
    public long getDiscoveryInterval() { return discoveryInterval; }
    public void setDiscoveryInterval(long discoveryInterval) { this.discoveryInterval = discoveryInterval; }
    public long getPeerTimeout() { return peerTimeout; }
    public void setPeerTimeout(long peerTimeout) { this.peerTimeout = peerTimeout; }
    public long getMaxFileSize() { return maxFileSize; }
    public void setMaxFileSize(long maxFileSize) { this.maxFileSize = maxFileSize; }
    public boolean isDebug() { return debug; }
    public void setDebug(boolean debug) { this.debug = debug; }
}
