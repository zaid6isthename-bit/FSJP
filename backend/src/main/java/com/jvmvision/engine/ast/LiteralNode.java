package com.jvmvision.engine.ast;

public class LiteralNode extends ExpressionNode {
    private final Object value;
    private final String typeName; // "int", "double", "String", "boolean", "null"

    public LiteralNode(int line, int column, Object value, String typeName) {
        super(line, column);
        this.value = value;
        this.typeName = typeName;
    }

    public Object getValue() {
        return value;
    }

    public String getTypeName() {
        return typeName;
    }
}
