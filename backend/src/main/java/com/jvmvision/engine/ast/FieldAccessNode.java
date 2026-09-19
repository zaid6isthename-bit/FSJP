package com.jvmvision.engine.ast;

public class FieldAccessNode extends ExpressionNode {
    private final ExpressionNode target;
    private final String fieldName;

    public FieldAccessNode(int line, int column, ExpressionNode target, String fieldName) {
        super(line, column);
        this.target = target;
        this.fieldName = fieldName;
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public String getFieldName() {
        return fieldName;
    }
}
