package com.jvmvision.engine.runtime;

import java.util.ArrayList;
import java.util.List;

public class HeapArray {
    private final long arrayId;
    private final String elementTypeName;
    private final List<RuntimeValue> elements = new ArrayList<>();
    private final int createdAtEvent;

    public HeapArray(long arrayId, String elementTypeName, int createdAtEvent) {
        this.arrayId = arrayId;
        this.elementTypeName = elementTypeName;
        this.createdAtEvent = createdAtEvent;
    }

    public long getArrayId() {
        return arrayId;
    }

    public String getElementTypeName() {
        return elementTypeName;
    }

    public List<RuntimeValue> getElements() {
        return elements;
    }

    public int getCreatedAtEvent() {
        return createdAtEvent;
    }

    public int length() {
        return elements.size();
    }

    public RuntimeValue get(int index) {
        return elements.get(index);
    }

    public void set(int index, RuntimeValue value) {
        elements.set(index, value);
    }

    public HeapArray copy() {
        HeapArray clone = new HeapArray(arrayId, elementTypeName, createdAtEvent);
        clone.elements.addAll(this.elements);
        return clone;
    }
}
