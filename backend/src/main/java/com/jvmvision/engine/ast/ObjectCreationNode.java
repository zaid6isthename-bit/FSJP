package com.jvmvision.engine.ast;

import java.util.List;

public class ObjectCreationNode extends ExpressionNode {
    private final String className;
    private final List<ExpressionNode> arguments;

    public ObjectCreationNode(int line, int column, String className, List<ExpressionNode> arguments) {
        super(line, column);
        this.className = className;
        this.arguments = arguments;
    }

    public String getClassName() {
        return className;
    }

    public List<ExpressionNode> getArguments() {
        return arguments;
    }
}
