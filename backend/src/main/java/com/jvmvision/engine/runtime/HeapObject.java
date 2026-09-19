package com.jvmvision.engine.runtime;

import java.util.LinkedHashMap;
import java.util.Map;

public class HeapObject {
    private final long objectId;
    private final String className;
    private final Map<String, RuntimeValue> fields = new LinkedHashMap<>();
    private final int createdAtEvent;

    public HeapObject(long objectId, String className, int createdAtEvent) {
        this.objectId = objectId;
        this.className = className;
        this.createdAtEvent = createdAtEvent;
    }

    public long getObjectId() {
        return objectId;
    }

    public String getClassName() {
        return className;
    }

    public Map<String, RuntimeValue> getFields() {
        return fields;
    }

    public int getCreatedAtEvent() {
        return createdAtEvent;
    }

    public RuntimeValue getField(String name) {
        return fields.get(name);
    }

    public void setField(String name, RuntimeValue value) {
        fields.put(name, value);
    }

    public HeapObject copy() {
        HeapObject clone = new HeapObject(objectId, className, createdAtEvent);
        clone.fields.putAll(this.fields);
        return clone;
    }
}
