package com.jvmvision.engine.errors;

public class ArithmeticSimulationException extends SimulationException {
    public ArithmeticSimulationException(int line, String message) {
        super(
                "ArithmeticException",
                message != null ? message : "/ by zero",
                line,
                null,
                "division or modulo by zero"
        );
    }
}
