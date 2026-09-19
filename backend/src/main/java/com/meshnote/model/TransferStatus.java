package com.meshnote.model;

public enum TransferStatus {
    QUEUED,
    CONNECTING,
    DOWNLOADING,
    UPLOADING,
    COMPLETED,
    FAILED,
    CANCELLED,
    PAUSED
}
