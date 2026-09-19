package com.jvmvision.engine.errors;

public class ExecutionLimitException extends SimulationException {
    public ExecutionLimitException(String message, int line) {
        super("ExecutionLimitExceeded", message, line, null, "execution safety limit");
    }
}
