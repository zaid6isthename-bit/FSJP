package com.meshnote.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class PathSanitizerTest {

    @Test
    public void testSanitizeFilename() {
        assertEquals("notes.pdf", PathSanitizer.sanitizeFilename("notes.pdf"));
        assertEquals("secret.txt", PathSanitizer.sanitizeFilename("../../secret.txt"));
        assertEquals("data.pdf", PathSanitizer.sanitizeFilename("..\\..\\data.pdf"));
        assertEquals("test_file.docx", PathSanitizer.sanitizeFilename("test:file.docx"));
        assertEquals("unnamed_file", PathSanitizer.sanitizeFilename(""));
        assertEquals("unnamed_file", PathSanitizer.sanitizeFilename(null));
    }

    @Test
    public void testAllowedExtensions() {
        assertTrue(PathSanitizer.isAllowedExtension("test.pdf"));
        assertTrue(PathSanitizer.isAllowedExtension("test.PPTX"));
        assertTrue(PathSanitizer.isAllowedExtension("test.docx"));
        assertTrue(PathSanitizer.isAllowedExtension("test.zip"));
        assertTrue(PathSanitizer.isAllowedExtension("test.png"));
        
        assertFalse(PathSanitizer.isAllowedExtension("test.exe"));
        assertFalse(PathSanitizer.isAllowedExtension("test.sh"));
        assertFalse(PathSanitizer.isAllowedExtension("test.bat"));
        assertFalse(PathSanitizer.isAllowedExtension("test"));
    }

    @Test
    public void testPathSafety(@TempDir File tempDir) throws IOException {
        File safeFile = new File(tempDir, "safe_document.pdf");
        assertTrue(PathSanitizer.isPathSafe(tempDir, safeFile));

        File unsafeFile = new File(tempDir, "../unsafe.txt");
        assertFalse(PathSanitizer.isPathSafe(tempDir, unsafeFile));
    }
}
