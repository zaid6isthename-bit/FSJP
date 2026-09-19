package com.jvmvision.engine.ast;

public class TryCatchNode extends StatementNode {
    private final BlockNode tryBlock;
    private final String exceptionType;
    private final String exceptionVarName;
    private final BlockNode catchBlock;

    public TryCatchNode(int line, int column, BlockNode tryBlock, String exceptionType, String exceptionVarName, BlockNode catchBlock) {
        super(line, column);
        this.tryBlock = tryBlock;
        this.exceptionType = exceptionType;
        this.exceptionVarName = exceptionVarName;
        this.catchBlock = catchBlock;
    }

    public BlockNode getTryBlock() {
        return tryBlock;
    }

    public String getExceptionType() {
        return exceptionType;
    }

    public String getExceptionVarName() {
        return exceptionVarName;
    }

    public BlockNode getCatchBlock() {
        return catchBlock;
    }
}
