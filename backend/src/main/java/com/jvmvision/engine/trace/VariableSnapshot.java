package com.jvmvision.engine.trace;

public class VariableSnapshot {
    private final String name;
    private final String type;
    private final Object rawValue;
    private final String displayValue;
    private final boolean isReference;
    private final Long targetObjectId;

    public VariableSnapshot(String name, String type, Object rawValue, String displayValue, boolean isReference, Long targetObjectId) {
        this.name = name;
        this.type = type;
        this.rawValue = rawValue;
        this.displayValue = displayValue;
        this.isReference = isReference;
        this.targetObjectId = targetObjectId;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Object getRawValue() {
        return rawValue;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public boolean isReference() {
        return isReference;
    }

    public Long getTargetObjectId() {
        return targetObjectId;
    }
}
