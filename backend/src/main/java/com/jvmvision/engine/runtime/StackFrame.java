package com.jvmvision.engine.runtime;

import java.util.LinkedHashMap;
import java.util.Map;

public class StackFrame {
    private final long frameId;
    private final String className;
    private final String methodName;
    private final Map<String, RuntimeValue> parameters = new LinkedHashMap<>();
    private final Map<String, RuntimeValue> localVariables = new LinkedHashMap<>();
    private int currentLine;
    private RuntimeValue returnValue;

    public StackFrame(long frameId, String className, String methodName, int currentLine) {
        this.frameId = frameId;
        this.className = className;
        this.methodName = methodName;
        this.currentLine = currentLine;
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

    public Map<String, RuntimeValue> getParameters() {
        return parameters;
    }

    public Map<String, RuntimeValue> getLocalVariables() {
        return localVariables;
    }

    public int getCurrentLine() {
        return currentLine;
    }

    public void setCurrentLine(int currentLine) {
        this.currentLine = currentLine;
    }

    public RuntimeValue getReturnValue() {
        return returnValue;
    }

    public void setReturnValue(RuntimeValue returnValue) {
        this.returnValue = returnValue;
    }

    public RuntimeValue getVariable(String name) {
        if (localVariables.containsKey(name)) {
            return localVariables.get(name);
        }
        return parameters.get(name);
    }

    public void setVariable(String name, RuntimeValue value) {
        if (parameters.containsKey(name)) {
            parameters.put(name, value);
        } else {
            localVariables.put(name, value);
        }
    }

    public boolean hasVariable(String name) {
        return localVariables.containsKey(name) || parameters.containsKey(name);
    }

    public StackFrame copy() {
        StackFrame clone = new StackFrame(frameId, className, methodName, currentLine);
        clone.parameters.putAll(this.parameters);
        clone.localVariables.putAll(this.localVariables);
        clone.returnValue = this.returnValue;
        return clone;
    }
}
