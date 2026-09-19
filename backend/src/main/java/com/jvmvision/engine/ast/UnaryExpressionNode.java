package com.jvmvision.engine.ast;

public class UnaryExpressionNode extends ExpressionNode {
    private final String operator;
    private final ExpressionNode operand;
    private final boolean isPrefix;

    public UnaryExpressionNode(int line, int column, String operator, ExpressionNode operand, boolean isPrefix) {
        super(line, column);
        this.operator = operator;
        this.operand = operand;
        this.isPrefix = isPrefix;
    }

    public String getOperator() {
        return operator;
    }

    public ExpressionNode getOperand() {
        return operand;
    }

    public boolean isPrefix() {
        return isPrefix;
    }
}
