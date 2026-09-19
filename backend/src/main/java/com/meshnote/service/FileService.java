package com.meshnote.service;

import com.meshnote.config.AppProperties;
import com.meshnote.dto.FileDto;
import com.meshnote.exception.MeshnoteException;
import com.meshnote.model.*;
import com.meshnote.network.P2pClient;
import com.meshnote.repository.ActivityRepository;
import com.meshnote.repository.NotificationRepository;
import com.meshnote.repository.SharedFileRepository;
import com.meshnote.util.FileStorageUtil;
import com.meshnote.util.PathSanitizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileService {

    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    private final SharedFileRepository sharedFileRepository;
    private final FileStorageUtil fileStorageUtil;
    private final ProfileService profileService;
    private final PeerRegistryService peerRegistryService;
    private final P2pClient p2pClient;
    private final ActivityRepository activityRepository;
    private final NotificationRepository notificationRepository;
    private final AppProperties appProperties;

    public FileService(SharedFileRepository sharedFileRepository,
                       FileStorageUtil fileStorageUtil,
                       ProfileService profileService,
                       PeerRegistryService peerRegistryService,
                       P2pClient p2pClient,
                       ActivityRepository activityRepository,
                       NotificationRepository notificationRepository,
                       AppProperties appProperties) {
        this.sharedFileRepository = sharedFileRepository;
        this.fileStorageUtil = fileStorageUtil;
        this.profileService = profileService;
        this.peerRegistryService = peerRegistryService;
        this.p2pClient = p2pClient;
        this.activityRepository = activityRepository;
        this.notificationRepository = notificationRepository;
        this.appProperties = appProperties;
    }

    public FileDto shareFile(MultipartFile file, String subject, String module, int semester, String description) {
        if (file == null || file.isEmpty()) {
            throw new MeshnoteException("Cannot upload an empty file", "EMPTY_FILE");
        }

        if (file.getSize() > appProperties.getMaxFileSize()) {
            throw new MeshnoteException("File size exceeds 500MB limit", "FILE_TOO_LARGE");
        }

        String originalName = PathSanitizer.sanitizeFilename(file.getOriginalFilename());
        if (!PathSanitizer.isAllowedExtension(originalName)) {
            throw new MeshnoteException("Unsupported file type. Supported types: PDF, PPT, PPTX, DOC, DOCX, PNG, JPG, ZIP, TXT", "INVALID_FILE_TYPE");
        }

        UserProfile profile = profileService.getOrCreateProfile();

        try {
            String storedName = fileStorageUtil.storeSharedFile(file.getInputStream(), originalName);

            SharedFile sharedFile = new SharedFile();
            sharedFile.setId(UUID.randomUUID().toString());
            sharedFile.setOriginalName(originalName);
            sharedFile.setStoredName(storedName);
            sharedFile.setMimeType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
            sharedFile.setSizeBytes(file.getSize());
            sharedFile.setSubject(subject != null && !subject.trim().isEmpty() ? subject.trim() : "General");
            sharedFile.setModule(module != null && !module.trim().isEmpty() ? module.trim() : "Module 1");
            sharedFile.setSemester(semester > 0 ? semester : profile.getSemester());
            sharedFile.setDescription(description != null ? description.trim() : "");
            sharedFile.setOwnerUserId(profile.getId());
            sharedFile.setShared(true);
            sharedFile.setAccessCount(0);
            sharedFile.setCreatedAt(LocalDateTime.now());
            sharedFile.setUpdatedAt(LocalDateTime.now());

            sharedFileRepository.save(sharedFile);

            activityRepository.save(new ActivityEvent(
                    null,
                    NetworkEventType.MATERIAL_SHARED,
                    "Shared: " + originalName,
                    "Added to local library (" + sharedFile.getSubject() + ", Sem " + sharedFile.getSemester() + ")",
                    null,
                    LocalDateTime.now()
            ));

            notificationRepository.save(new Notification(
                    null,
                    NotificationType.FILE_SHARED,
                    "Material Shared",
                    originalName + " is now accessible to peers on the local network",
                    false,
                    LocalDateTime.now()
            ));

            log.info("Shared new file '{}' with ID {}", originalName, sharedFile.getId());
            return toDto(sharedFile, profile.getName(), profile.getId());

        } catch (IOException e) {
            log.error("Failed to store file: {}", originalName, e);
            throw new MeshnoteException("Failed to store file on disk: " + e.getMessage(), "STORAGE_ERROR");
        }
    }

    public List<FileDto> getAllLocalFiles() {
        UserProfile profile = profileService.getOrCreateProfile();
        return sharedFileRepository.findAll().stream()
                .map(f -> toDto(f, profile.getName(), profile.getId()))
                .collect(Collectors.toList());
    }

    public Optional<SharedFile> getLocalFile(String id) {
        return sharedFileRepository.findById(id);
    }

    public FileDto pauseSharing(String id) {
        SharedFile file = sharedFileRepository.findById(id)
                .orElseThrow(() -> MeshnoteException.notFound("File not found: " + id));
        file.setShared(false);
        sharedFileRepository.update(file);

        activityRepository.save(new ActivityEvent(
                null,
                NetworkEventType.SHARING_PAUSED,
                "Paused: " + file.getOriginalName(),
                "File temporarily hidden from peer network",
                null,
                LocalDateTime.now()
        ));

        UserProfile profile = profileService.getOrCreateProfile();
        return toDto(file, profile.getName(), profile.getId());
    }

    public FileDto resumeSharing(String id) {
        SharedFile file = sharedFileRepository.findById(id)
                .orElseThrow(() -> MeshnoteException.notFound("File not found: " + id));
        file.setShared(true);
        sharedFileRepository.update(file);

        activityRepository.save(new ActivityEvent(
                null,
                NetworkEventType.SHARING_RESUMED,
                "Resumed: " + file.getOriginalName(),
                "File is visible to peers again",
                null,
                LocalDateTime.now()
        ));

        UserProfile profile = profileService.getOrCreateProfile();
        return toDto(file, profile.getName(), profile.getId());
    }

    public void deleteFile(String id) {
        SharedFile file = sharedFileRepository.findById(id)
                .orElseThrow(() -> MeshnoteException.notFound("File not found: " + id));

        fileStorageUtil.deleteSharedFile(file.getStoredName());
        sharedFileRepository.deleteById(id);

        activityRepository.save(new ActivityEvent(
                null,
                NetworkEventType.MATERIAL_SHARED,
                "Deleted: " + file.getOriginalName(),
                "Removed from local library and peer mesh",
                null,
                LocalDateTime.now()
        ));
    }

    /**
     * Search implementation per user instructions:
     * GET local files + LIST_FILES from each online peer -> combine -> filter/search
     */
    public List<FileDto> searchFiles(String query) {
        UserProfile profile = profileService.getOrCreateProfile();
        List<FileDto> allFiles = new ArrayList<>();

        // 1. Local files
        for (SharedFile f : sharedFileRepository.findAllShared()) {
            allFiles.add(toDto(f, profile.getName(), profile.getId()));
        }

        // 2. Query each online peer sequentially
        for (PeerInfo peer : peerRegistryService.getOnlinePeers()) {
            try {
                List<FileDto> remote = p2pClient.queryRemoteFiles(peer.getIpAddress(), peer.getP2pPort(), peer.getNodeId(), peer.getName());
                allFiles.addAll(remote);
            } catch (Exception e) {
                log.warn("Could not retrieve file list from peer {}: {}", peer.getName(), e.getMessage());
            }
        }

        // 3. Filter if query provided
        if (query == null || query.trim().isEmpty()) {
            return allFiles;
        }

        String q = query.toLowerCase().trim();
        return allFiles.stream()
                .filter(f -> (f.getName() != null && f.getName().toLowerCase().contains(q)) ||
                             (f.getSubject() != null && f.getSubject().toLowerCase().contains(q)) ||
                             (f.getModule() != null && f.getModule().toLowerCase().contains(q)) ||
                             (f.getOwnerName() != null && f.getOwnerName().toLowerCase().contains(q)) ||
                             (f.getDescription() != null && f.getDescription().toLowerCase().contains(q)))
                .collect(Collectors.toList());
    }

    public List<FileDto> getPeerFiles(String peerId) {
        PeerInfo peer = peerRegistryService.getPeer(peerId)
                .orElseThrow(() -> MeshnoteException.notFound("Peer not found: " + peerId));
        return p2pClient.queryRemoteFiles(peer.getIpAddress(), peer.getP2pPort(), peer.getNodeId(), peer.getName());
    }

    public FileDto toDto(SharedFile file, String ownerName, String peerId) {
        FileDto dto = new FileDto();
        dto.setId(file.getId());
        dto.setName(file.getOriginalName());
        dto.setMimeType(file.getMimeType());
        dto.setType(FileDto.determineType(file.getOriginalName(), file.getMimeType()));
        dto.setSizeBytes(file.getSizeBytes());
        dto.setSubject(file.getSubject());
        dto.setModule(file.getModule());
        dto.setSemester(file.getSemester());
        dto.setDescription(file.getDescription());
        dto.setOwnerName(ownerName);
        dto.setPeerId(peerId);
        dto.setAvailable(true);
        dto.setShared(file.isShared());
        dto.setAccessCount(file.getAccessCount());
        dto.setCreatedAt(file.getCreatedAt());
        return dto;
    }
}
