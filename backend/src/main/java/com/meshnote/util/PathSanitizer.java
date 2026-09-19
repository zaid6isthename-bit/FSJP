package com.meshnote.util;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class PathSanitizer {

    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "pdf", "ppt", "pptx", "doc", "docx", "png", "jpg", "jpeg", "zip", "txt"
    ));

    /**
     * Sanitizes a user-supplied filename to prevent path traversal attacks.
     */
    public static String sanitizeFilename(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return "unnamed_file";
        }

        // Take only the file name part, strip directory paths
        String cleanName = filename.trim();
        int lastSlash = Math.max(cleanName.lastIndexOf('/'), cleanName.lastIndexOf('\\'));
        if (lastSlash >= 0 && lastSlash < cleanName.length() - 1) {
            cleanName = cleanName.substring(lastSlash + 1);
        }

        // Remove dangerous characters
        cleanName = cleanName.replaceAll("[\\\\/:*?\"<>|]", "_");
        cleanName = cleanName.replace("..", "_");

        if (cleanName.trim().isEmpty()) {
            return "unnamed_file";
        }
        return cleanName;
    }

    /**
     * Verifies that the resolved path is strictly within the target directory.
     */
    public static boolean isPathSafe(File targetDir, File targetFile) {
        try {
            String canonicalTargetDir = targetDir.getCanonicalPath();
            String canonicalTargetFile = targetFile.getCanonicalPath();
            return canonicalTargetFile.startsWith(canonicalTargetDir);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts extension and checks if supported.
     */
    public static boolean isAllowedExtension(String filename) {
        if (filename == null) return false;
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex <= 0 || dotIndex == filename.length() - 1) return false;
        String ext = filename.substring(dotIndex + 1).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(ext);
    }

    public static String getFileExtension(String filename) {
        if (filename == null) return "";
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex <= 0 || dotIndex == filename.length() - 1) return "";
        return filename.substring(dotIndex + 1).toLowerCase();
    }
}
