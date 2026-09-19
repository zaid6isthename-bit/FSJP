# JVM VISION Runtime Memory Model

## 1. Overview

JVM VISION provides a fully transparent, observable memory model representing how Java manages runtime state. The memory model is split cleanly between:

1. **The Call Stack**: Tracks currently executing methods, invocation hierarchies, local variables, and return targets.
2. **The Heap**: Tracks all dynamically allocated class instances (`HeapObject`) and arrays (`HeapArray`).
3. **References**: Pointers that connect stack variables or object fields to specific heap entities.

```text
┌─────────────────────────────────────────────────────────────┐
│                         CALL STACK                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ study()  [Frame #2, Line 14]                          │  │
│  │   this ──────────┐                                    │  │
│  └──────────────────┼────────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────┼────────────────────────────────────┐  │
│  │ main()   [Frame #1, Line 7]                           │  │
│  │   student ───────┼──────────┐                         │  │
│  │   x = 10         │          │                         │  │
│  └──────────────────┼──────────┼─────────────────────────┘  │
└─────────────────────┼──────────┼────────────────────────────┘
                      │          │
                      ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│                            HEAP                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Object #1 : Student                                   │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ name:  "Zaid"                                         │  │
│  │ marks: 10                                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Runtime Value Representation (`RuntimeValue`)

In the engine, any variable, field, expression result, or array element is represented by an instance of `RuntimeValue`. It is a tagged union with the following variants:

| Type Tag | Java Model | Description | Example Values |
| :--- | :--- | :--- | :--- |
| `INT` | `int` | 32-bit signed integer | `0`, `42`, `-10` |
| `DOUBLE` | `double` | 64-bit IEEE 754 floating point | `3.14`, `-0.001` |
| `BOOLEAN` | `boolean` | Logical truth value | `true`, `false` |
| `STRING` | `String` | Text literal / string value | `"Hello"`, `"Zaid"` |
| `OBJECT_REF`| Object Reference | Reference pointer to a heap-allocated object ID | `ref(1) -> Student` |
| `ARRAY_REF` | Array Reference | Reference pointer to a heap-allocated array ID | `arrayRef(2) -> int[3]` |
| `NULL` | `null` | Null reference (points to no heap entity) | `null` |

---

## 3. Call Stack & Stack Frames (`StackFrame`)

The call stack is represented as a LIFO deque: `Deque<StackFrame> callStack`.

### Frame Structure
```text
StackFrame {
    frameId: int              // Unique sequential frame number
    methodName: String        // Name of the method ("main", "study", "calculate")
    className: String         // Class declaring the method ("Main", "Student")
    line: int                 // Current line executing in this frame
    localVariables: Map<String, RuntimeValue> // Variables declared in this frame
    returnValue: RuntimeValue // Stored when returning back to caller
}
```

### Method Invocation Lifecycle
1. **Method Enter (`METHOD_ENTER`)**:
   - Caller evaluates argument expressions.
   - A new `StackFrame` is pushed to the deque.
   - Formal parameters are bound to the evaluated argument values.
   - If the method is an instance method, `this` is bound to the target object reference.
   - An execution event with a stack snapshot is recorded.

2. **Method Execution**:
   - Variables declared inside the method are inserted into the frame's `localVariables` map.
   - Control flow (loops, `if` statements) update the frame's line position.

3. **Method Return (`METHOD_EXIT`)**:
   - The `return` statement evaluates the return expression.
   - The value is stored in `frame.returnValue`.
   - The frame is popped off the deque.
   - The returned value is transferred back into the caller frame's expression evaluation context.

---

## 4. Heap Objects & Memory Layout (`HeapObject`)

All instances created with `new ClassName(...)` reside on the heap: `Map<Integer, HeapObject> heap`.

```text
HeapObject {
    objectId: int                   // Stable integer ID (e.g. 1, 2, 3...)
    className: String               // Type name ("Student", "Person")
    fields: Map<String, RuntimeValue> // Key-value map of instance fields
    createdAtEvent: int             // Monotonic event ID when instantiated
}
```

### Allocation Steps:
1. Generate new `objectId = ++nextObjectId`.
2. Inspect class AST definition for instance field declarations and evaluate their default values.
3. Instantiate `HeapObject(objectId, className, initialFields)`.
4. Register object in global heap table: `heap.put(objectId, object)`.
5. Invoke class constructor with `this = RuntimeValue.objectRef(objectId, className)`.
6. Emit `OBJECT_CREATED` event.

---

## 5. Arrays on the Heap (`HeapArray`)

Arrays in Java are objects on the heap. In JVM VISION, arrays are modeled through `HeapArray`:

```text
HeapArray {
    arrayId: int                    // Stable integer ID
    elementType: String             // "int", "String", "boolean", etc.
    elements: List<RuntimeValue>    // Indexed list of elements
    createdAtEvent: int             // Event index when instantiated
}
```

When an array element is modified (`numbers[0] = 99;`):
1. The target array reference is resolved.
2. Bounds checking verifies `0 <= index < elements.size()`.
3. The element is updated in-place.
4. An `ARRAY_CHANGED` event is recorded with the new snapshot.

---

## 6. Null Reference Dereference & Exception Triggering

When evaluating field access (`s.name`) or method invocation (`s.study()`):
1. The target expression `s` evaluates to a `RuntimeValue`.
2. If `value.getType() == RuntimeValue.Type.NULL`:
   - The interpreter aborts execution immediately.
   - Identifies the variable or expression name (`"s"`).
   - Throws `NullPointerSimulationException("Cannot read field 'name' because 's' is null", line, "s", "name")`.
   - Emits an `EXCEPTION_THROWN` event with a complete failure snapshot.
   - Halts further execution and activates the Failure Forensics engine.
