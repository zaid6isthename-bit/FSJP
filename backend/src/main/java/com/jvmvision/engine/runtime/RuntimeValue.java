package com.jvmvision.engine.runtime;

import java.util.Objects;

public class RuntimeValue {
    public enum ValueKind {
        PRIMITIVE_INT,
        PRIMITIVE_DOUBLE,
        PRIMITIVE_BOOLEAN,
        STRING,
        OBJECT_REFERENCE,
        ARRAY_REFERENCE,
        NULL
    }

    private final ValueKind kind;
    private final String typeName;
    private final Object rawValue;
    private final Long referenceId; // objectId or arrayId if reference

    private RuntimeValue(ValueKind kind, String typeName, Object rawValue, Long referenceId) {
        this.kind = kind;
        this.typeName = typeName;
        this.rawValue = rawValue;
        this.referenceId = referenceId;
    }

    public static RuntimeValue ofInt(int val) {
        return new RuntimeValue(ValueKind.PRIMITIVE_INT, "int", val, null);
    }

    public static RuntimeValue ofDouble(double val) {
        return new RuntimeValue(ValueKind.PRIMITIVE_DOUBLE, "double", val, null);
    }

    public static RuntimeValue ofBoolean(boolean val) {
        return new RuntimeValue(ValueKind.PRIMITIVE_BOOLEAN, "boolean", val, null);
    }

    public static RuntimeValue ofString(String val) {
        return new RuntimeValue(ValueKind.STRING, "String", val, null);
    }

    public static RuntimeValue ofReference(long objectId, String className) {
        return new RuntimeValue(ValueKind.OBJECT_REFERENCE, className, null, objectId);
    }

    public static RuntimeValue ofArray(long arrayId, String elementTypeName) {
        return new RuntimeValue(ValueKind.ARRAY_REFERENCE, elementTypeName + "[]", null, arrayId);
    }

    public static RuntimeValue nullValue(String declaredType) {
        return new RuntimeValue(ValueKind.NULL, declaredType != null ? declaredType : "null", null, null);
    }

    public ValueKind getKind() {
        return kind;
    }

    public String getTypeName() {
        return typeName;
    }

    public Object getRawValue() {
        return rawValue;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public boolean isNull() {
        return kind == ValueKind.NULL;
    }

    public boolean isReference() {
        return kind == ValueKind.OBJECT_REFERENCE || kind == ValueKind.ARRAY_REFERENCE;
    }

    public int asInt() {
        if (rawValue instanceof Number) {
            return ((Number) rawValue).intValue();
        }
        throw new IllegalStateException("Value is not an integer: " + rawValue);
    }

    public double asDouble() {
        if (rawValue instanceof Number) {
            return ((Number) rawValue).doubleValue();
        }
        throw new IllegalStateException("Value is not a double: " + rawValue);
    }

    public boolean asBoolean() {
        if (rawValue instanceof Boolean) {
            return (Boolean) rawValue;
        }
        throw new IllegalStateException("Value is not a boolean: " + rawValue);
    }

    public String asString() {
        if (kind == ValueKind.NULL) return "null";
        if (kind == ValueKind.OBJECT_REFERENCE) return "Object #" + referenceId;
        if (kind == ValueKind.ARRAY_REFERENCE) return "Array #" + referenceId;
        return String.valueOf(rawValue);
    }

    public String getDisplayValue() {
        if (kind == ValueKind.NULL) return "null";
        if (kind == ValueKind.STRING) return "\"" + rawValue + "\"";
        if (kind == ValueKind.OBJECT_REFERENCE) return "Object #" + referenceId;
        if (kind == ValueKind.ARRAY_REFERENCE) return "Array #" + referenceId;
        return String.valueOf(rawValue);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RuntimeValue that = (RuntimeValue) o;
        return kind == that.kind &&
                Objects.equals(rawValue, that.rawValue) &&
                Objects.equals(referenceId, that.referenceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(kind, rawValue, referenceId);
    }

    @Override
    public String toString() {
        return getDisplayValue();
    }
}
