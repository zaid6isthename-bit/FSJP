package com.jvmvision.engine.ast;

public class BinaryExpressionNode extends ExpressionNode {
    private final ExpressionNode left;
    private final String operator;
    private final ExpressionNode right;

    public BinaryExpressionNode(int line, int column, ExpressionNode left, String operator, ExpressionNode right) {
        super(line, column);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public ExpressionNode getLeft() {
        return left;
    }

    public String getOperator() {
        return operator;
    }

    public ExpressionNode getRight() {
        return right;
    }
}
