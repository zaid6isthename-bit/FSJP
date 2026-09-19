package com.jvmvision.engine.ast;

public class VariableExpressionNode extends ExpressionNode {
    private final String name;

    public VariableExpressionNode(int line, int column, String name) {
        super(line, column);
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
