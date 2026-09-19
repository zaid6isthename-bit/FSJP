package com.jvmvision.engine.ast;

import java.util.List;

public class ConstructorNode extends ASTNode {
    private final String className;
    private final List<ParameterNode> parameters;
    private final BlockNode body;

    public ConstructorNode(int line, int column, String className, List<ParameterNode> parameters, BlockNode body) {
        super(line, column);
        this.className = className;
        this.parameters = parameters;
        this.body = body;
    }

    public String getClassName() {
        return className;
    }

    public List<ParameterNode> getParameters() {
        return parameters;
    }

    public BlockNode getBody() {
        return body;
    }
}
