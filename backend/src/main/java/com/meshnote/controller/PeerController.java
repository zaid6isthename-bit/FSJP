package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.FileDto;
import com.meshnote.dto.PeerDto;
import com.meshnote.exception.MeshnoteException;
import com.meshnote.model.PeerInfo;
import com.meshnote.network.UdpDiscoveryService;
import com.meshnote.service.FileService;
import com.meshnote.service.PeerRegistryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/peers")
public class PeerController {

    private final PeerRegistryService peerRegistryService;
    private final FileService fileService;
    private final UdpDiscoveryService udpDiscoveryService;

    public PeerController(PeerRegistryService peerRegistryService,
                          FileService fileService,
                          UdpDiscoveryService udpDiscoveryService) {
        this.peerRegistryService = peerRegistryService;
        this.fileService = fileService;
        this.udpDiscoveryService = udpDiscoveryService;
    }

    @GetMapping
    public ApiResponse<List<PeerDto>> getAllPeers() {
        List<PeerDto> dtos = peerRegistryService.getAllPeers().stream()
                .map(peerRegistryService::toDto)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos);
    }

    @GetMapping("/{peerId}")
    public ApiResponse<PeerDto> getPeer(@PathVariable String peerId) {
        PeerInfo peer = peerRegistryService.getPeer(peerId)
                .orElseThrow(() -> MeshnoteException.notFound("Peer not found: " + peerId));
        return ApiResponse.ok(peerRegistryService.toDto(peer));
    }

    @GetMapping("/{peerId}/files")
    public ApiResponse<List<FileDto>> getPeerFiles(@PathVariable String peerId) {
        List<FileDto> files = fileService.getPeerFiles(peerId);
        return ApiResponse.ok(files);
    }

    @PostMapping("/discover")
    public ApiResponse<List<PeerDto>> triggerDiscovery() {
        udpDiscoveryService.broadcastBeacon();
        List<PeerDto> dtos = peerRegistryService.getAllPeers().stream()
                .map(peerRegistryService::toDto)
                .collect(Collectors.toList());
        return ApiResponse.ok(dtos, "Discovery beacon broadcasted");
    }
}
