package com.jvmvision.engine.ast;

public class ReturnNode extends StatementNode {
    private final ExpressionNode value; // can be null

    public ReturnNode(int line, int column, ExpressionNode value) {
        super(line, column);
        this.value = value;
    }

    public ExpressionNode getValue() {
        return value;
    }
}
