package com.jvmvision.engine.ast;

public class VariableDeclarationNode extends StatementNode {
    private final String type;
    private final String name;
    private final ExpressionNode initializer;

    public VariableDeclarationNode(int line, int column, String type, String name, ExpressionNode initializer) {
        super(line, column);
        this.type = type;
        this.name = name;
        this.initializer = initializer;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public ExpressionNode getInitializer() {
        return initializer;
    }
}
