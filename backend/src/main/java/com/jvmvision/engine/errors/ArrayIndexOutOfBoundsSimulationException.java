package com.jvmvision.engine.errors;

public class ArrayIndexOutOfBoundsSimulationException extends SimulationException {
    public ArrayIndexOutOfBoundsSimulationException(int line, int index, int length) {
        super(
                "ArrayIndexOutOfBoundsException",
                String.format("Index %d out of bounds for length %d", index, length),
                line,
                null,
                String.format("access array element at index %d", index)
        );
    }
}
