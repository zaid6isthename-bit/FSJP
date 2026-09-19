package com.jvmvision.engine.trace;

import java.util.List;

public class StackFrameSnapshot {
    private final long frameId;
    private final String className;
    private final String methodName;
    private final int line;
    private final List<VariableSnapshot> localVariables;
    private final List<VariableSnapshot> parameters;
    private final String returnValueDisplay;

    public StackFrameSnapshot(long frameId, String className, String methodName, int line,
                              List<VariableSnapshot> localVariables,
                              List<VariableSnapshot> parameters,
                              String returnValueDisplay) {
        this.frameId = frameId;
        this.className = className;
        this.methodName = methodName;
        this.line = line;
        this.localVariables = localVariables;
        this.parameters = parameters;
        this.returnValueDisplay = returnValueDisplay;
    }

    public long getFrameId() {
        return frameId;
    }

    public String getClassName() {
        return className;
    }

    public String getMethodName() {
        return methodName;
    }

    public int getLine() {
        return line;
    }

    public List<VariableSnapshot> getLocalVariables() {
        return localVariables;
    }

    public List<VariableSnapshot> getParameters() {
        return parameters;
    }

    public String getReturnValueDisplay() {
        return returnValueDisplay;
    }
}
