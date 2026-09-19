package com.meshnote.service;

import com.meshnote.dto.DownloadRequest;
import com.meshnote.dto.FileDto;
import com.meshnote.dto.TransferDto;
import com.meshnote.exception.MeshnoteException;
import com.meshnote.model.*;
import com.meshnote.network.P2pClient;
import com.meshnote.repository.ActivityRepository;
import com.meshnote.repository.NotificationRepository;
import com.meshnote.repository.TransferRepository;
import com.meshnote.util.FileStorageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class TransferService {

    private static final Logger log = LoggerFactory.getLogger(TransferService.class);

    private final TransferRepository transferRepository;
    private final PeerRegistryService peerRegistryService;
    private final P2pClient p2pClient;
    private final FileStorageUtil fileStorageUtil;
    private final ActivityRepository activityRepository;
    private final NotificationRepository notificationRepository;
    private final ExecutorService transferExecutor;

    // Track active cancellation tokens
    private final Map<String, AtomicBoolean> cancellationTokens = new ConcurrentHashMap<>();

    public TransferService(TransferRepository transferRepository,
                           PeerRegistryService peerRegistryService,
                           P2pClient p2pClient,
                           FileStorageUtil fileStorageUtil,
                           ActivityRepository activityRepository,
                           NotificationRepository notificationRepository,
                           @Qualifier("transferExecutor") ExecutorService transferExecutor) {
        this.transferRepository = transferRepository;
        this.peerRegistryService = peerRegistryService;
        this.p2pClient = p2pClient;
        this.fileStorageUtil = fileStorageUtil;
        this.activityRepository = activityRepository;
        this.notificationRepository = notificationRepository;
        this.transferExecutor = transferExecutor;
    }

    /**
     * Initiates an asynchronous download from a remote peer.
     * Returns immediately with the created Transfer object.
     */
    public TransferDto initiateDownload(DownloadRequest request) {
        PeerInfo peer = peerRegistryService.getPeer(request.getPeerId())
                .orElseThrow(() -> MeshnoteException.peerOffline("Peer"));

        if (peer.getStatus() == PeerStatus.OFFLINE) {
            throw MeshnoteException.peerOffline(peer.getName());
        }

        String transferId = "tr_" + UUID.randomUUID().toString().substring(0, 8);

        Transfer transfer = new Transfer();
        transfer.setId(transferId);
        transfer.setFileId(request.getFileId());
        transfer.setFileName("Requesting file metadata...");
        transfer.setDirection(TransferDirection.DOWNLOAD);
        transfer.setPeerNodeId(peer.getNodeId());
        transfer.setPeerName(peer.getName());
        transfer.setBytesTotal(1); // placeholder until header arrives
        transfer.setBytesTransferred(0);
        transfer.setSpeedBps(0);
        transfer.setStatus(TransferStatus.QUEUED);
        transfer.setStartedAt(LocalDateTime.now());

        transferRepository.save(transfer);

        AtomicBoolean cancelToken = new AtomicBoolean(false);
        cancellationTokens.put(transferId, cancelToken);

        // Submit to background thread pool
        transferExecutor.submit(() -> executeDownloadTask(transfer, peer, cancelToken));

        log.info("Queued download transfer {} for file {} from peer {}", transferId, request.getFileId(), peer.getName());
        return toDto(transfer);
    }

    private void executeDownloadTask(Transfer transfer, PeerInfo peer, AtomicBoolean cancelToken) {
        try {
            transfer.setStatus(TransferStatus.CONNECTING);
            transferRepository.update(transfer);

            File destination = fileStorageUtil.createDownloadDestination("temp_" + transfer.getId());

            p2pClient.downloadFile(peer.getIpAddress(), peer.getP2pPort(), transfer.getFileId(), destination,
                    new P2pClient.ProgressCallback() {
                        private long lastDbUpdate = 0;

                        @Override
                        public void onProgress(long bytesTransferred, long bytesTotal, long speedBps) {
                            transfer.setBytesTransferred(bytesTransferred);
                            transfer.setBytesTotal(bytesTotal);
                            transfer.setSpeedBps(speedBps);
                            transfer.setStatus(TransferStatus.DOWNLOADING);

                            long now = System.currentTimeMillis();
                            if (now - lastDbUpdate >= 1000) { // update DB every 1 sec
                                lastDbUpdate = now;
                                transferRepository.update(transfer);
                            }
                        }

                        @Override
                        public boolean isCancelled() {
                            return cancelToken.get();
                        }
                    });

            if (cancelToken.get()) {
                transfer.setStatus(TransferStatus.CANCELLED);
                transfer.setErrorMessage("Transfer cancelled by user");
                destination.delete();
            } else {
                transfer.setStatus(TransferStatus.COMPLETED);
                transfer.setCompletedAt(LocalDateTime.now());
                transfer.setSpeedBps(0);
                transfer.setBytesTransferred(transfer.getBytesTotal());

                activityRepository.save(new ActivityEvent(
                        null,
                        NetworkEventType.TRANSFER_COMPLETED,
                        "Downloaded: " + transfer.getFileName(),
                        "Received from " + peer.getName() + " (" + FileDto.formatBytes(transfer.getBytesTotal()) + ")",
                        peer.getNodeId(),
                        LocalDateTime.now()
                ));

                notificationRepository.save(new Notification(
                        null,
                        NotificationType.TRANSFER_COMPLETED,
                        "Download Complete",
                        "Finished downloading " + transfer.getFileName() + " from " + peer.getName(),
                        false,
                        LocalDateTime.now()
                ));
            }

        } catch (Exception e) {
            log.error("Transfer {} failed: {}", transfer.getId(), e.getMessage());
            transfer.setStatus(TransferStatus.FAILED);
            transfer.setErrorMessage(e.getMessage() != null ? e.getMessage() : "Connection failed during transfer");
            transfer.setCompletedAt(LocalDateTime.now());

            activityRepository.save(new ActivityEvent(
                    null,
                    NetworkEventType.TRANSFER_FAILED,
                    "Transfer failed",
                    transfer.getErrorMessage() + " (peer: " + peer.getName() + ")",
                    peer.getNodeId(),
                    LocalDateTime.now()
            ));

            notificationRepository.save(new Notification(
                    null,
                    NotificationType.TRANSFER_FAILED,
                    "Transfer Failed",
                    "Could not download " + transfer.getFileName() + ": " + transfer.getErrorMessage(),
                    false,
                    LocalDateTime.now()
            ));
        } finally {
            transferRepository.update(transfer);
            cancellationTokens.remove(transfer.getId());
        }
    }

    public TransferDto cancelTransfer(String transferId) {
        Transfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() -> MeshnoteException.notFound("Transfer not found: " + transferId));

        AtomicBoolean token = cancellationTokens.get(transferId);
        if (token != null) {
            token.set(true);
        }

        transfer.setStatus(TransferStatus.CANCELLED);
        transfer.setErrorMessage("Cancelled by user");
        transfer.setCompletedAt(LocalDateTime.now());
        transferRepository.update(transfer);

        return toDto(transfer);
    }

    public TransferDto retryTransfer(String transferId) {
        Transfer original = transferRepository.findById(transferId)
                .orElseThrow(() -> MeshnoteException.notFound("Transfer not found: " + transferId));

        return initiateDownload(new DownloadRequest(original.getPeerNodeId(), original.getFileId()));
    }

    public List<TransferDto> getAllTransfers() {
        return transferRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<TransferDto> getTransfer(String id) {
        return transferRepository.findById(id).map(this::toDto);
    }

    public int getActiveTransferCount() {
        return transferRepository.countActive();
    }

    public TransferDto toDto(Transfer transfer) {
        TransferDto dto = new TransferDto();
        dto.setId(transfer.getId());
        dto.setFileId(transfer.getFileId());
        dto.setFileName(transfer.getFileName());
        dto.setDirection(transfer.getDirection());
        dto.setPeerNodeId(transfer.getPeerNodeId());
        dto.setPeerName(transfer.getPeerName());
        dto.setBytesTotal(transfer.getBytesTotal());
        dto.setBytesTransferred(transfer.getBytesTransferred());
        dto.setProgress(transfer.getProgressPercentage());
        dto.setSpeedBps(transfer.getSpeedBps());
        dto.setStatus(transfer.getStatus());
        dto.setEstimatedSecondsRemaining(transfer.getEstimatedSecondsRemaining());
        dto.setErrorMessage(transfer.getErrorMessage());
        dto.setStartedAt(transfer.getStartedAt());
        dto.setCompletedAt(transfer.getCompletedAt());
        return dto;
    }
}
