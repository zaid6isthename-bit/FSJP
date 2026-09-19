package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.DownloadRequest;
import com.meshnote.dto.TransferDto;
import com.meshnote.exception.MeshnoteException;
import com.meshnote.service.TransferService;
import com.meshnote.util.FileStorageUtil;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;
    private final FileStorageUtil fileStorageUtil;

    public TransferController(TransferService transferService, FileStorageUtil fileStorageUtil) {
        this.transferService = transferService;
        this.fileStorageUtil = fileStorageUtil;
    }

    @GetMapping
    public ApiResponse<List<TransferDto>> getAllTransfers() {
        return ApiResponse.ok(transferService.getAllTransfers());
    }

    @GetMapping("/{id}")
    public ApiResponse<TransferDto> getTransfer(@PathVariable String id) {
        TransferDto transfer = transferService.getTransfer(id)
                .orElseThrow(() -> MeshnoteException.notFound("Transfer not found: " + id));
        return ApiResponse.ok(transfer);
    }

    @PostMapping("/download")
    public ApiResponse<TransferDto> startDownload(@Valid @RequestBody DownloadRequest request) {
        TransferDto transfer = transferService.initiateDownload(request);
        return ApiResponse.ok(transfer, "Transfer initiated");
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<TransferDto> cancelTransfer(@PathVariable String id) {
        TransferDto transfer = transferService.cancelTransfer(id);
        return ApiResponse.ok(transfer, "Transfer cancelled");
    }

    @PostMapping("/{id}/retry")
    public ApiResponse<TransferDto> retryTransfer(@PathVariable String id) {
        TransferDto transfer = transferService.retryTransfer(id);
        return ApiResponse.ok(transfer, "Transfer retried");
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<Resource> getDownloadedContent(@PathVariable String id) {
        TransferDto transfer = transferService.getTransfer(id)
                .orElseThrow(() -> MeshnoteException.notFound("Transfer not found: " + id));

        File file = fileStorageUtil.getDownloadedFile(transfer.getFileName());
        if (file == null || !file.exists()) {
            throw MeshnoteException.notFound("Downloaded file not found in local storage");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + transfer.getFileName() + "\"")
                .body(new FileSystemResource(file));
    }
}
