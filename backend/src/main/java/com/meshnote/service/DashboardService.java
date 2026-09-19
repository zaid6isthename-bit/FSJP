package com.meshnote.service;

import com.meshnote.dto.DashboardStatsDto;
import com.meshnote.network.UdpDiscoveryService;
import com.meshnote.repository.SharedFileRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final PeerRegistryService peerRegistryService;
    private final SharedFileRepository sharedFileRepository;
    private final TransferService transferService;
    private final UdpDiscoveryService udpDiscoveryService;

    public DashboardService(PeerRegistryService peerRegistryService,
                            SharedFileRepository sharedFileRepository,
                            TransferService transferService,
                            UdpDiscoveryService udpDiscoveryService) {
        this.peerRegistryService = peerRegistryService;
        this.sharedFileRepository = sharedFileRepository;
        this.transferService = transferService;
        this.udpDiscoveryService = udpDiscoveryService;
    }

    public DashboardStatsDto getDashboardStats() {
        int nearbyPeers = peerRegistryService.getAllPeers().size();
        int activePeers = peerRegistryService.getOnlinePeerCount();
        int localShared = sharedFileRepository.countShared();

        // Calculate available files: local shared + sum of peers' shared file counts
        int remoteFiles = peerRegistryService.getOnlinePeers().stream()
                .mapToInt(p -> p.getSharedFileCount())
                .sum();
        int totalAvailableFiles = localShared + remoteFiles;

        int activeTransfers = transferService.getActiveTransferCount();
        boolean networkConnected = udpDiscoveryService.isRunning();

        return new DashboardStatsDto(
                nearbyPeers,
                activePeers,
                totalAvailableFiles,
                localShared,
                activeTransfers,
                networkConnected
        );
    }
}
