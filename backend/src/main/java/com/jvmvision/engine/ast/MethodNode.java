package com.jvmvision.engine.ast;

import java.util.List;

public class MethodNode extends ASTNode {
    private final String returnType;
    private final String name;
    private final boolean isStatic;
    private final List<ParameterNode> parameters;
    private final BlockNode body;

    public MethodNode(int line, int column, String returnType, String name, boolean isStatic, List<ParameterNode> parameters, BlockNode body) {
        super(line, column);
        this.returnType = returnType;
        this.name = name;
        this.isStatic = isStatic;
        this.parameters = parameters;
        this.body = body;
    }

    public String getReturnType() {
        return returnType;
    }

    public String getName() {
        return name;
    }

    public boolean isStatic() {
        return isStatic;
    }

    public List<ParameterNode> getParameters() {
        return parameters;
    }

    public BlockNode getBody() {
        return body;
    }
}
