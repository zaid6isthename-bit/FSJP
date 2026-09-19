package com.jvmvision.engine.parser;

public class ParseException extends RuntimeException {
    private final int line;
    private final int column;

    public ParseException(String message, int line, int column) {
        super(String.format("Line %d, col %d: %s", line, column, message));
        this.line = line;
        this.column = column;
    }

    public int getLine() {
        return line;
    }

    public int getColumn() {
        return column;
    }
}
