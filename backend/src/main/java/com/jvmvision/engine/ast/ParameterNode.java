package com.jvmvision.engine.ast;

public class ParameterNode extends ASTNode {
    private final String type;
    private final String name;

    public ParameterNode(int line, int column, String type, String name) {
        super(line, column);
        this.type = type;
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }
}
