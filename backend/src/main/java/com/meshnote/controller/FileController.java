package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.FileDto;
import com.meshnote.exception.MeshnoteException;
import com.meshnote.model.SharedFile;
import com.meshnote.service.FileService;
import com.meshnote.service.ProfileService;
import com.meshnote.util.FileStorageUtil;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;
    private final FileStorageUtil fileStorageUtil;
    private final ProfileService profileService;

    public FileController(FileService fileService,
                          FileStorageUtil fileStorageUtil,
                          ProfileService profileService) {
        this.fileService = fileService;
        this.fileStorageUtil = fileStorageUtil;
        this.profileService = profileService;
    }

    @GetMapping
    public ApiResponse<List<FileDto>> getMyFiles() {
        return ApiResponse.ok(fileService.getAllLocalFiles());
    }

    @GetMapping("/{id}")
    public ApiResponse<FileDto> getFile(@PathVariable String id) {
        SharedFile file = fileService.getLocalFile(id)
                .orElseThrow(() -> MeshnoteException.notFound("File not found: " + id));
        String ownerName = profileService.getOrCreateProfile().getName();
        return ApiResponse.ok(fileService.toDto(file, ownerName, file.getOwnerUserId()));
    }

    @GetMapping("/search")
    public ApiResponse<List<FileDto>> searchFiles(@RequestParam(value = "q", required = false, defaultValue = "") String query) {
        return ApiResponse.ok(fileService.searchFiles(query));
    }

    @PostMapping(value = "/share", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileDto> shareFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subject", required = false, defaultValue = "General") String subject,
            @RequestParam(value = "module", required = false, defaultValue = "Module 1") String module,
            @RequestParam(value = "semester", required = false, defaultValue = "3") int semester,
            @RequestParam(value = "description", required = false, defaultValue = "") String description) {

        FileDto shared = fileService.shareFile(file, subject, module, semester, description);
        return ApiResponse.ok(shared, "File shared successfully to local academic network");
    }

    @PostMapping("/{id}/pause")
    public ApiResponse<FileDto> pauseSharing(@PathVariable String id) {
        FileDto paused = fileService.pauseSharing(id);
        return ApiResponse.ok(paused, "Sharing paused");
    }

    @PostMapping("/{id}/resume")
    public ApiResponse<FileDto> resumeSharing(@PathVariable String id) {
        FileDto resumed = fileService.resumeSharing(id);
        return ApiResponse.ok(resumed, "Sharing resumed");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFile(@PathVariable String id) {
        fileService.deleteFile(id);
        return ApiResponse.ok(null, "File deleted from library");
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<Resource> getFileContent(@PathVariable String id) {
        SharedFile file = fileService.getLocalFile(id)
                .orElseThrow(() -> MeshnoteException.notFound("File not found: " + id));

        File diskFile = fileStorageUtil.getSharedFile(file.getStoredName());
        if (!diskFile.exists()) {
            throw MeshnoteException.notFound("Physical file missing on disk");
        }

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(file.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalName() + "\"")
                .body(new FileSystemResource(diskFile));
    }
}
