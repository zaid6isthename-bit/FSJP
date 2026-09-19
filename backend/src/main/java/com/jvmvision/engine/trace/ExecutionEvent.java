package com.jvmvision.engine.trace;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ExecutionEvent {
    private final int sequence;
    private final int line;
    private final EventType eventType;
    private final long timestamp;
    private final String description;
    private final List<StackFrameSnapshot> stackFrames;
    private final List<HeapObjectSnapshot> heapObjects;
    private final List<HeapArraySnapshot> heapArrays;
    private final String output;
    private final String highlightedVariable;
    private final Long highlightedObjectId;
    private final Map<String, Object> metadata;

    public ExecutionEvent(int sequence, int line, EventType eventType, long timestamp, String description,
                          List<StackFrameSnapshot> stackFrames,
                          List<HeapObjectSnapshot> heapObjects,
                          List<HeapArraySnapshot> heapArrays,
                          String output,
                          String highlightedVariable,
                          Long highlightedObjectId,
                          Map<String, Object> metadata) {
        this.sequence = sequence;
        this.line = line;
        this.eventType = eventType;
        this.timestamp = timestamp;
        this.description = description;
        this.stackFrames = stackFrames != null ? stackFrames : Collections.emptyList();
        this.heapObjects = heapObjects != null ? heapObjects : Collections.emptyList();
        this.heapArrays = heapArrays != null ? heapArrays : Collections.emptyList();
        this.output = output != null ? output : "";
        this.highlightedVariable = highlightedVariable;
        this.highlightedObjectId = highlightedObjectId;
        this.metadata = metadata != null ? metadata : Collections.emptyMap();
    }

    public int getSequence() {
        return sequence;
    }

    public int getLine() {
        return line;
    }

    public EventType getEventType() {
        return eventType;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getDescription() {
        return description;
    }

    public List<StackFrameSnapshot> getStackFrames() {
        return stackFrames;
    }

    public List<HeapObjectSnapshot> getHeapObjects() {
        return heapObjects;
    }

    public List<HeapArraySnapshot> getHeapArrays() {
        return heapArrays;
    }

    public String getOutput() {
        return output;
    }

    public String getHighlightedVariable() {
        return highlightedVariable;
    }

    public Long getHighlightedObjectId() {
        return highlightedObjectId;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }
}
