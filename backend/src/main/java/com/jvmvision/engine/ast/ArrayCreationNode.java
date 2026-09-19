package com.jvmvision.engine.ast;

import java.util.List;

public class ArrayCreationNode extends ExpressionNode {
    private final String elementTypeName;
    private final ExpressionNode sizeExpression;      // e.g. new int[5] (nullable if initializer present)
    private final List<ExpressionNode> initializers;  // e.g. {1, 2, 3} (nullable if size present)

    public ArrayCreationNode(int line, int column, String elementTypeName, ExpressionNode sizeExpression, List<ExpressionNode> initializers) {
        super(line, column);
        this.elementTypeName = elementTypeName;
        this.sizeExpression = sizeExpression;
        this.initializers = initializers;
    }

    public String getElementTypeName() {
        return elementTypeName;
    }

    public ExpressionNode getSizeExpression() {
        return sizeExpression;
    }

    public List<ExpressionNode> getInitializers() {
        return initializers;
    }
}
