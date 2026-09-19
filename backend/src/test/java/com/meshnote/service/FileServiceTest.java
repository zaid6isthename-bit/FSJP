package com.meshnote.service;

import com.meshnote.config.AppProperties;
import com.meshnote.dto.FileDto;
import com.meshnote.model.SharedFile;
import com.meshnote.model.UserProfile;
import com.meshnote.network.P2pClient;
import com.meshnote.repository.ActivityRepository;
import com.meshnote.repository.NotificationRepository;
import com.meshnote.repository.SharedFileRepository;
import com.meshnote.util.FileStorageUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FileServiceTest {

    @Mock
    private SharedFileRepository sharedFileRepository;

    @Mock
    private FileStorageUtil fileStorageUtil;

    @Mock
    private ProfileService profileService;

    @Mock
    private PeerRegistryService peerRegistryService;

    @Mock
    private P2pClient p2pClient;

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private NotificationRepository notificationRepository;

    private AppProperties appProperties;
    private FileService fileService;
    private UserProfile testProfile;

    @BeforeEach
    public void setup() {
        appProperties = new AppProperties();
        fileService = new FileService(
                sharedFileRepository,
                fileStorageUtil,
                profileService,
                peerRegistryService,
                p2pClient,
                activityRepository,
                notificationRepository,
                appProperties
        );

        testProfile = new UserProfile(
                "user-1",
                "Zaid Mohammed",
                "AI & ML",
                3,
                "Zaid-Laptop",
                true,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    public void testShareFileSuccess() throws Exception {
        when(profileService.getOrCreateProfile()).thenReturn(testProfile);
        when(fileStorageUtil.storeSharedFile(any(InputStream.class), any(String.class))).thenReturn("stored_uuid.pdf");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "DataStructures.pdf",
                "application/pdf",
                "test document content".getBytes()
        );

        FileDto result = fileService.shareFile(file, "Data Structures", "Module 1", 3, "Notes on trees");

        assertNotNull(result);
        assertEquals("DataStructures.pdf", result.getName());
        assertEquals("Data Structures", result.getSubject());
        assertEquals("Module 1", result.getModule());
        assertEquals("PDF", result.getType());
        assertTrue(result.isShared());

        verify(sharedFileRepository, times(1)).save(any(SharedFile.class));
        verify(activityRepository, times(1)).save(any());
        verify(notificationRepository, times(1)).save(any());
    }

    @Test
    public void testPauseAndResumeSharing() {
        SharedFile file = new SharedFile();
        file.setId("file-123");
        file.setOriginalName("AlgorithmNotes.pdf");
        file.setStoredName("stored.pdf");
        file.setMimeType("application/pdf");
        file.setSizeBytes(1024);
        file.setShared(true);

        when(sharedFileRepository.findById("file-123")).thenReturn(Optional.of(file));
        when(profileService.getOrCreateProfile()).thenReturn(testProfile);

        // Pause
        FileDto paused = fileService.pauseSharing("file-123");
        assertFalse(paused.isShared());
        verify(sharedFileRepository, times(1)).update(argThat(f -> !f.isShared()));

        // Resume
        FileDto resumed = fileService.resumeSharing("file-123");
        assertTrue(resumed.isShared());
        verify(sharedFileRepository, times(2)).update(any(SharedFile.class));
    }

    @Test
    public void testSearchLocalFiles() {
        SharedFile file = new SharedFile();
        file.setId("file-1");
        file.setOriginalName("Operating Systems Module 2.pdf");
        file.setStoredName("os.pdf");
        file.setSubject("Operating Systems");
        file.setModule("Module 2");
        file.setMimeType("application/pdf");
        file.setSizeBytes(2048);
        file.setShared(true);

        when(profileService.getOrCreateProfile()).thenReturn(testProfile);
        when(sharedFileRepository.findAllShared()).thenReturn(List.of(file));
        when(peerRegistryService.getOnlinePeers()).thenReturn(Collections.emptyList());

        List<FileDto> results = fileService.searchFiles("Operating");
        assertEquals(1, results.size());
        assertEquals("Operating Systems Module 2.pdf", results.get(0).getName());

        List<FileDto> noResults = fileService.searchFiles("Chemistry");
        assertEquals(0, noResults.size());
    }
}
