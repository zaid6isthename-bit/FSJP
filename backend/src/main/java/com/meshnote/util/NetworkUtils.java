package com.meshnote.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.*;
import java.util.*;

public class NetworkUtils {

    private static final Logger log = LoggerFactory.getLogger(NetworkUtils.class);

    /**
     * Determines the active non-loopback LAN IPv4 address.
     * Prioritizes Wi-Fi / Ethernet adapters.
     */
    public static String getLocalLanIp() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            
            // First pass: look for up, non-loopback, non-virtual Wi-Fi or Ethernet interfaces
            for (NetworkInterface nif : interfaces) {
                if (!isValidInterface(nif)) continue;

                for (InterfaceAddress ifAddr : nif.getInterfaceAddresses()) {
                    InetAddress addr = ifAddr.getAddress();
                    if (isPreferredIpv4(addr)) {
                        return addr.getHostAddress();
                    }
                }
            }

            // Fallback: any non-loopback IPv4
            for (NetworkInterface nif : interfaces) {
                if (!nif.isUp() || nif.isLoopback()) continue;
                for (InterfaceAddress ifAddr : nif.getInterfaceAddresses()) {
                    InetAddress addr = ifAddr.getAddress();
                    if (addr instanceof Inet4Address && !addr.isLoopbackAddress()) {
                        return addr.getHostAddress();
                    }
                }
            }

            return InetAddress.getLocalHost().getHostAddress();
        } catch (Exception e) {
            log.warn("Could not determine local LAN IP address, using 127.0.0.1: {}", e.getMessage());
            return "127.0.0.1";
        }
    }

    /**
     * Returns broadcast addresses for all active network interfaces plus global broadcast.
     */
    public static List<InetAddress> getBroadcastAddresses() {
        Set<InetAddress> broadcastList = new HashSet<>();
        try {
            // Always include global broadcast
            broadcastList.add(InetAddress.getByName("255.255.255.255"));

            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface networkInterface = interfaces.nextElement();
                if (!isValidInterface(networkInterface)) continue;

                for (InterfaceAddress interfaceAddress : networkInterface.getInterfaceAddresses()) {
                    InetAddress broadcast = interfaceAddress.getBroadcast();
                    if (broadcast != null) {
                        broadcastList.add(broadcast);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error resolving broadcast addresses: {}", e.getMessage());
        }
        return new ArrayList<>(broadcastList);
    }

    /**
     * Gets a friendly name for the current active network.
     */
    public static String getActiveNetworkName() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface nif : interfaces) {
                if (!isValidInterface(nif)) continue;
                for (InterfaceAddress ifAddr : nif.getInterfaceAddresses()) {
                    if (isPreferredIpv4(ifAddr.getAddress())) {
                        String displayName = nif.getDisplayName();
                        if (displayName != null && !displayName.isEmpty()) {
                            return displayName.length() > 24 ? displayName.substring(0, 24) : displayName;
                        }
                        return nif.getName();
                    }
                }
            }
        } catch (Exception ignored) {}
        return "Local Academic Network";
    }

    private static boolean isValidInterface(NetworkInterface nif) {
        try {
            if (!nif.isUp() || nif.isLoopback() || nif.isVirtual()) return false;
            String name = nif.getName().toLowerCase();
            String display = nif.getDisplayName().toLowerCase();
            // Filter out common virtual/container adapters
            if (name.contains("docker") || name.contains("veth") || name.contains("wsl") || 
                display.contains("virtual") || display.contains("vmware") || display.contains("vbox") ||
                display.contains("hyper-v")) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean isPreferredIpv4(InetAddress addr) {
        if (!(addr instanceof Inet4Address)) return false;
        if (addr.isLoopbackAddress() || addr.isLinkLocalAddress()) return false;
        return addr.isSiteLocalAddress(); // 192.168.x.x, 10.x.x.x, 172.16-31.x.x
    }
}
