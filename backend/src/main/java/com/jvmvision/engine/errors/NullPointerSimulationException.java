package com.jvmvision.engine.errors;

public class NullPointerSimulationException extends SimulationException {
    public NullPointerSimulationException(int line, String variableName, String attemptedOperation) {
        super(
                "NullPointerException",
                String.format("Cannot %s because '%s' is null", attemptedOperation, variableName),
                line,
                variableName,
                attemptedOperation
        );
    }
}
