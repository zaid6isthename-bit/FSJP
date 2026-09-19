package com.jvmvision.engine.trace;

import java.util.List;

public class HeapArraySnapshot {
    private final long arrayId;
    private final String elementTypeName;
    private final List<String> elements;
    private final int createdAtEvent;

    public HeapArraySnapshot(long arrayId, String elementTypeName, List<String> elements, int createdAtEvent) {
        this.arrayId = arrayId;
        this.elementTypeName = elementTypeName;
        this.elements = elements;
        this.createdAtEvent = createdAtEvent;
    }

    public long getArrayId() {
        return arrayId;
    }

    public String getElementTypeName() {
        return elementTypeName;
    }

    public List<String> getElements() {
        return elements;
    }

    public int getCreatedAtEvent() {
        return createdAtEvent;
    }
}
