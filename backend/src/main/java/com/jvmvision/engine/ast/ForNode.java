package com.jvmvision.engine.ast;

public class ForNode extends StatementNode {
    private final StatementNode initializer; // can be VariableDeclarationNode or AssignmentNode or null
    private final ExpressionNode condition;   // can be null (default true)
    private final StatementNode update;        // can be AssignmentNode or ExpressionStatementNode or null
    private final StatementNode body;

    public ForNode(int line, int column, StatementNode initializer, ExpressionNode condition, StatementNode update, StatementNode body) {
        super(line, column);
        this.initializer = initializer;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }

    public StatementNode getInitializer() {
        return initializer;
    }

    public ExpressionNode getCondition() {
        return condition;
    }

    public StatementNode getUpdate() {
        return update;
    }

    public StatementNode getBody() {
        return body;
    }
}
