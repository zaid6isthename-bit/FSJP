# JVM VISION Execution Trace Format

## 1. Overview

An **Execution Trace** (`ExecutionTrace`) is the complete, chronologically ordered recording of a Java program's runtime lifecycle. The trace is generated during AST interpretation on the Spring Boot backend, serialized to JSON, and consumed by the React visualizer.

The trace enables:
- Step-by-step playback with accurate line numbers
- Bidirectional time-travel scrubbing (scrubbing forward or backward across snapshots)
- Deterministic failure replay
- State inspection of local variables, call stack frames, and heap objects at every point in time

---

## 2. Event Types (`EventType`)

The engine generates 17 discrete types of execution events:

| Event Type | Trigger | Description |
| :--- | :--- | :--- |
| `PROGRAM_STARTED` | Main method entry | Program execution begins |
| `LINE_EXECUTED` | Statement evaluated | General statement line completion |
| `VARIABLE_CREATED`| Variable declaration | New local variable declared in active frame |
| `VARIABLE_CHANGED`| Assignment statement | Existing local variable assigned a new value |
| `OBJECT_CREATED`  | `new` expression | New class instance allocated on heap |
| `FIELD_CHANGED`   | Field assignment | Instance field modified on a heap object |
| `METHOD_ENTER`    | Method invocation | New stack frame pushed onto the call stack |
| `METHOD_EXIT`     | Return statement | Stack frame completed and popped from call stack |
| `CONDITION_EVALUATED` | `if`/`while` test | Boolean branch expression evaluated |
| `LOOP_ITERATION`  | Loop condition pass | New iteration of `for` or `while` loop |
| `ARRAY_CREATED`   | Array initialization | New array allocated on heap |
| `ARRAY_CHANGED`   | Array index write | Array element updated |
| `OUTPUT_WRITTEN`  | `System.out.println` | String or primitive printed to stdout |
| `EXCEPTION_THROWN`| Runtime error / throw | Unhandled exception raised |
| `EXCEPTION_CAUGHT`| `catch` block | Exception successfully caught |
| `PROGRAM_COMPLETED`| Program termination | Execution reached normal termination |
| `PROGRAM_FAILED`  | Fatal simulation crash | Execution aborted due to unhandled failure |

---

## 3. JSON Schema Specification

### Top-Level `ExecutionTrace` Object
```json
{
  "events": [ /* ExecutionEvent[] */ ],
  "status": "COMPLETED | FAILED | LIMIT_EXCEEDED",
  "error": {
    "exceptionType": "NullPointerException",
    "message": "Cannot read field 'name' because 'student' is null",
    "line": 4,
    "variableName": "student",
    "failedOperation": "field access 'name'",
    "rootCause": "Attempted to access field 'name' on reference 'student' which has value null.",
    "whatToCheck": "Ensure 'student' is initialized with 'new Student(...)' before dereferencing."
  },
  "totalEvents": 12,
  "output": "Hello Zaid\n"
}
```

---

### `ExecutionEvent` Snapshot Object
```json
{
  "eventId": 1,
  "sequence": 1,
  "line": 8,
  "eventType": "VARIABLE_CREATED",
  "description": "Created local variable student = Object #1",
  "stackSnapshot": [
    {
      "frameId": 1,
      "methodName": "main",
      "className": "Main",
      "line": 8,
      "localVariables": {
        "student": {
          "type": "OBJECT_REF",
          "value": "ref(1)",
          "refId": 1,
          "className": "Student"
        }
      },
      "returnValue": null
    }
  ],
  "heapSnapshot": {
    "1": {
      "objectId": 1,
      "className": "Student",
      "fields": {
        "name": {
          "type": "STRING",
          "value": "Zaid"
        },
        "marks": {
          "type": "INT",
          "value": 0
        }
      }
    }
  },
  "arraysSnapshot": {},
  "outputSnapshot": "Output generated up to this step..."
}
```

---

## 4. Immutable Snapshots & O(1) Time-Travel

To enable instant timeline scrubbing without complex diff recalculations:
1. Each `ExecutionEvent` holds an **immutable deep copy** of the active stack, heap, and output at the exact instant the event occurred.
2. When the user moves the timeline scrubber to event index `k`, the React UI immediately applies `trace.events[k]` directly to the state:
   - Active source line = `event.line`
   - Active call stack = `event.stackSnapshot`
   - Active heap = `event.heapSnapshot`
   - Active output = `event.outputSnapshot`
3. This guarantees O(1) rendering time regardless of whether the user jumps 1 step forward or 500 steps backward.
