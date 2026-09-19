package com.jvmvision.engine.ast;

public class AssignmentNode extends ExpressionNode {
    private final ExpressionNode target;
    private final String operator;
    private final ExpressionNode value;

    public AssignmentNode(int line, int column, ExpressionNode target, String operator, ExpressionNode value) {
        super(line, column);
        this.target = target;
        this.operator = operator;
        this.value = value;
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public String getOperator() {
        return operator;
    }

    public ExpressionNode getValue() {
        return value;
    }
}
