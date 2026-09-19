package com.jvmvision.engine.errors;

public class SimulationException extends RuntimeException {
    private final String exceptionType;
    private final int line;
    private final String variableName;
    private final String attemptedOperation;

    public SimulationException(String exceptionType, String message, int line, String variableName, String attemptedOperation) {
        super(message);
        this.exceptionType = exceptionType;
        this.line = line;
        this.variableName = variableName;
        this.attemptedOperation = attemptedOperation;
    }

    public String getExceptionType() {
        return exceptionType;
    }

    public int getLine() {
        return line;
    }

    public String getVariableName() {
        return variableName;
    }

    public String getAttemptedOperation() {
        return attemptedOperation;
    }
}
