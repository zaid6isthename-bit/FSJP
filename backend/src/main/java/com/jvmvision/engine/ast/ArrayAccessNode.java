package com.jvmvision.engine.ast;

public class ArrayAccessNode extends ExpressionNode {
    private final ExpressionNode target;
    private final ExpressionNode index;

    public ArrayAccessNode(int line, int column, ExpressionNode target, ExpressionNode index) {
        super(line, column);
        this.target = target;
        this.index = index;
    }

    public ExpressionNode getTarget() {
        return target;
    }

    public ExpressionNode getIndex() {
        return index;
    }
}
