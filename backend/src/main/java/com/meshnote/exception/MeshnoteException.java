package com.meshnote.exception;

import org.springframework.http.HttpStatus;

public class MeshnoteException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public MeshnoteException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public MeshnoteException(String message, String errorCode) {
        this(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public static MeshnoteException notFound(String message) {
        return new MeshnoteException(message, "NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    public static MeshnoteException peerOffline(String peerName) {
        return new MeshnoteException(peerName + " is currently offline or unreachable", "PEER_OFFLINE", HttpStatus.BAD_REQUEST);
    }

    public static MeshnoteException sharingDisabled(String message) {
        return new MeshnoteException(message, "SHARING_DISABLED", HttpStatus.FORBIDDEN);
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
