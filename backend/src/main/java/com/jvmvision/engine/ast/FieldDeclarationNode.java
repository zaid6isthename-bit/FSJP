package com.jvmvision.engine.ast;

public class FieldDeclarationNode extends ASTNode {
    private final String type;
    private final String name;
    private final ExpressionNode initializer;

    public FieldDeclarationNode(int line, int column, String type, String name, ExpressionNode initializer) {
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
