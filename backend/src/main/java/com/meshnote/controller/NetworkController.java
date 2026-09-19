package com.meshnote.controller;

import com.meshnote.config.AppProperties;
import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.NetworkStatusDto;
import com.meshnote.model.UserProfile;
import com.meshnote.network.UdpDiscoveryService;
import com.meshnote.service.PeerRegistryService;
import com.meshnote.service.ProfileService;
import com.meshnote.util.NetworkUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/network")
public class NetworkController {

    private final AppProperties appProperties;
    private final ProfileService profileService;
    private final PeerRegistryService peerRegistryService;
    private final UdpDiscoveryService udpDiscoveryService;

    @Value("${server.port:8080}")
    private int serverPort;

    public NetworkController(AppProperties appProperties,
                             ProfileService profileService,
                             PeerRegistryService peerRegistryService,
                             UdpDiscoveryService udpDiscoveryService) {
        this.appProperties = appProperties;
        this.profileService = profileService;
        this.peerRegistryService = peerRegistryService;
        this.udpDiscoveryService = udpDiscoveryService;
    }

    @GetMapping("/status")
    public ApiResponse<NetworkStatusDto> getNetworkStatus() {
        return ApiResponse.ok(buildStatusDto());
    }

    @PostMapping("/discover")
    public ApiResponse<NetworkStatusDto> manualDiscover() {
        udpDiscoveryService.broadcastBeacon();
        return ApiResponse.ok(buildStatusDto(), "Discovery beacon broadcasted");
    }

    private NetworkStatusDto buildStatusDto() {
        UserProfile profile = profileService.getOrCreateProfile();
        NetworkStatusDto dto = new NetworkStatusDto();
        dto.setConnected(udpDiscoveryService.isRunning());
        dto.setNetworkName(NetworkUtils.getActiveNetworkName());
        dto.setLocalIp(NetworkUtils.getLocalLanIp());
        dto.setApiPort(serverPort);
        dto.setP2pPort(appProperties.getP2pPort());
        dto.setDiscoveryPort(appProperties.getDiscoveryPort());
        dto.setPeerCount(peerRegistryService.getOnlinePeerCount());
        dto.setDiscoverable(profile.isDiscoverable());
        dto.setSharingEnabled(profile.isSharingEnabled());
        dto.setDiscoveryActive(udpDiscoveryService.isRunning());
        dto.setNodeId(profile.getId());
        if (udpDiscoveryService.getLastHeartbeat() != null) {
            dto.setLastHeartbeat(udpDiscoveryService.getLastHeartbeat().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        }
        return dto;
    }
}
