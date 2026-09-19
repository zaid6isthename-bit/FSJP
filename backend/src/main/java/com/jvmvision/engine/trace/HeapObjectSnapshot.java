package com.jvmvision.engine.trace;

import java.util.Map;

public class HeapObjectSnapshot {
    private final long objectId;
    private final String className;
    private final Map<String, VariableSnapshot> fields;
    private final int createdAtEvent;

    public HeapObjectSnapshot(long objectId, String className, Map<String, VariableSnapshot> fields, int createdAtEvent) {
        this.objectId = objectId;
        this.className = className;
        this.fields = fields;
        this.createdAtEvent = createdAtEvent;
    }

    public long getObjectId() {
        return objectId;
    }

    public String getClassName() {
        return className;
    }

    public Map<String, VariableSnapshot> getFields() {
        return fields;
    }

    public int getCreatedAtEvent() {
        return createdAtEvent;
    }
}
