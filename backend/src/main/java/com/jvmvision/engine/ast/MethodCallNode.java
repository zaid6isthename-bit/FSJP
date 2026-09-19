package com.jvmvision.engine.ast;

import java.util.List;

public class MethodCallNode extends ExpressionNode {
    private final ExpressionNode target; // nullable for local/static method calls
    private final String methodName;
    private final List<ExpressionNode> arguments;

    public MethodCallNode(int line, int column, ExpressionNode target, String methodName, List<ExpressionNode> arguments) {
        super(line, column);
        this.target = target;
        this.methodName = methodName;
        this.arguments = arguments;
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public String getMethodName() {
        return methodName;
    }

    public List<ExpressionNode> getArguments() {
        return arguments;
    }
}
