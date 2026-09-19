package com.jvmvision.engine.ast;

public class IfNode extends StatementNode {
    private final ExpressionNode condition;
    private final StatementNode thenBranch;
    private final StatementNode elseBranch; // can be null

    public IfNode(int line, int column, ExpressionNode condition, StatementNode thenBranch, StatementNode elseBranch) {
        super(line, column);
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    public ExpressionNode getCondition() {
        return condition;
    }

    public StatementNode getThenBranch() {
        return thenBranch;
    }

    public StatementNode getElseBranch() {
        return elseBranch;
    }
}
