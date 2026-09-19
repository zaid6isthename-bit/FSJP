package com.meshnote.util;

import com.meshnote.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private static final Logger log = LoggerFactory.getLogger(FileStorageUtil.class);
    private final AppProperties appProperties;

    public FileStorageUtil(AppProperties appProperties) {
        this.appProperties = appProperties;
        initDirectories();
    }

    public void initDirectories() {
        try {
            Files.createDirectories(Paths.get(appProperties.getSharedDirectory()));
            Files.createDirectories(Paths.get(appProperties.getDownloadDirectory()));
        } catch (IOException e) {
            log.error("Failed to initialize storage directories", e);
        }
    }

    /**
     * Stores an uploaded file in data/shared with a generated UUID name.
     */
    public String storeSharedFile(InputStream inputStream, String originalFilename) throws IOException {
        String ext = PathSanitizer.getFileExtension(originalFilename);
        String storedName = UUID.randomUUID().toString() + (ext.isEmpty() ? "" : "." + ext);

        File targetFile = new File(appProperties.getSharedDirectory(), storedName);
        if (!PathSanitizer.isPathSafe(new File(appProperties.getSharedDirectory()), targetFile)) {
            throw new SecurityException("Potential path traversal detected");
        }

        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(targetFile), 64 * 1024)) {
            byte[] buffer = new byte[64 * 1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
        }
        return storedName;
    }

    /**
     * Returns the physical File object for a stored shared file.
     */
    public File getSharedFile(String storedName) {
        File targetFile = new File(appProperties.getSharedDirectory(), storedName);
        if (!PathSanitizer.isPathSafe(new File(appProperties.getSharedDirectory()), targetFile)) {
            throw new SecurityException("Potential path traversal detected");
        }
        return targetFile;
    }

    /**
     * Deletes a shared file from disk.
     */
    public boolean deleteSharedFile(String storedName) {
        File file = getSharedFile(storedName);
        if (file.exists()) {
            return file.delete();
        }
        return false;
    }

    /**
     * Creates a destination File in data/downloads with sanitized name, handling duplicate names safely.
     */
    public File createDownloadDestination(String originalFilename) throws IOException {
        String cleanName = PathSanitizer.sanitizeFilename(originalFilename);
        File downloadsDir = new File(appProperties.getDownloadDirectory());
        File destination = new File(downloadsDir, cleanName);

        if (!PathSanitizer.isPathSafe(downloadsDir, destination)) {
            throw new SecurityException("Unsafe download destination path");
        }

        // If file already exists, append counter e.g. "Notes (1).pdf"
        if (destination.exists()) {
            String nameWithoutExt = cleanName;
            String ext = "";
            int dotIndex = cleanName.lastIndexOf('.');
            if (dotIndex > 0) {
                nameWithoutExt = cleanName.substring(0, dotIndex);
                ext = cleanName.substring(dotIndex);
            }

            int counter = 1;
            while (destination.exists()) {
                destination = new File(downloadsDir, nameWithoutExt + " (" + counter + ")" + ext);
                counter++;
            }
        }
        return destination;
    }

    public File getDownloadedFile(String filename) {
        File downloadsDir = new File(appProperties.getDownloadDirectory());
        File file = new File(downloadsDir, filename);
        if (!PathSanitizer.isPathSafe(downloadsDir, file) || !file.exists()) {
            return null;
        }
        return file;
    }
}
