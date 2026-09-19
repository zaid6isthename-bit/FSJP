package com.jvmvision.engine.ast;

public class ThrowNode extends StatementNode {
    private final ExpressionNode expression;

    public ThrowNode(int line, int column, ExpressionNode expression) {
        super(line, column);
        this.expression = expression;
    }

    public ExpressionNode getExpression() {
        return expression;
    }
}
