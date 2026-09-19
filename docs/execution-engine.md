# JVM VISION Execution Engine

## 1. Overview & Purpose

The **JVM VISION Educational Execution Engine** (`com.jvmvision.engine`) is the computational core of the platform. It takes raw Java source code, converts it into a typed Abstract Syntax Tree (AST), and executes it within a sandboxed interpreter that generates an immutable, step-by-step trace of execution events.

Unlike a production JVM (which compiles source code into bytecode executed via the HotSpot C1/C2 JIT compiler or interpreter loop over machine memory), the JVM VISION engine executes directly on the AST representation. This design deliberately prioritizes:

1. **Exact Source Attribution**: Every AST node retains source line and column numbers.
2. **Deterministic Sandboxing**: No host operating system access, no arbitrary file or network I/O, no process spawning.
3. **Deep State Introspection**: Total transparency into every variable change, heap allocation, method frame transition, and expression evaluation.
4. **Time-Travel Capability**: Deterministic capture of immutable snapshots after each execution step.

---

## 2. Engine Pipeline & Architecture

The execution pipeline consists of four discrete, decoupled stages:

```text
    Java Source Code
           │
           ▼
    [1. Lexer / Tokenizer]
           │
           ▼  List<Token> (keywords, identifiers, literals, operators, line numbers)
    [2. Parser]
           │
           ▼  ProgramNode (AST: Classes, Methods, Statements, Expressions)
    [3. Interpreter] ◄──── Memory Model (CallStack, Heap, Stdout)
           │
           ▼  Watchdog & Execution Safety Limits (steps, loop iterations, call depth)
    [4. Execution Trace]
           │
           ▼  List<ExecutionEvent> (with immutable state snapshots)
    JSON Serialization & React Visualizer
```

---

## 3. Package Structure

```text
com.jvmvision.engine/
├── lexer/
│   ├── Lexer.java                 # Source scanner & tokenizer
│   ├── Token.java                 # Token record (type, lexeme, line, column, literal value)
│   └── TokenType.java             # Keyword, symbol, literal, and EOF enum
├── ast/
│   ├── ASTNode.java               # Base node with line & column tracking
│   ├── ProgramNode.java           # Root AST node containing classes and statements
│   ├── ClassNode.java             # Class declaration with fields, constructors, methods
│   ├── MethodNode.java            # Method declaration with parameters & body block
│   ├── ConstructorNode.java       # Class constructor declaration
│   ├── FieldDeclarationNode.java  # Instance field declaration
│   ├── StatementNode.java         # Base statement node
│   ├── ExpressionNode.java        # Base expression node
│   ├── BlockNode.java             # Enclosed sequence of statements
│   ├── VariableDeclarationNode.java # Local variable definition with optional initializer
│   ├── AssignmentNode.java        # Variable, field, or array element assignment
│   ├── IfNode.java                # Conditional branching (if / else)
│   ├── WhileNode.java             # While loop statement
│   ├── ForNode.java               # Standard for loop statement
│   ├── ReturnNode.java            # Method return statement
│   ├── ExpressionStatementNode.java # Wrapper for expressions evaluated as statements
│   ├── TryCatchNode.java          # Exception handling block
│   ├── ThrowNode.java             # Explicit throw statement
│   ├── BinaryExpressionNode.java # Binary operators (+, -, *, /, %, ==, !=, <, >, <=, >=, &&, ||)
│   ├── UnaryExpressionNode.java  # Unary operators (-, !, ++)
│   ├── LiteralNode.java          # Int, double, boolean, string, or null literal
│   ├── VariableExpressionNode.java # Variable lookup by identifier
│   ├── MethodCallNode.java        # Method invocation with target object & arguments
│   ├── ObjectCreationNode.java   # new ClassName(args...) instantiation
│   ├── FieldAccessNode.java       # object.fieldName dereference
│   ├── ArrayCreationNode.java    # new int[size] or {1, 2, 3} creation
│   ├── ArrayAccessNode.java      # array[index] indexing
│   └── ThisExpressionNode.java   # 'this' reference inside instance methods/constructors
├── parser/
│   ├── Parser.java                # Recursive-descent AST builder with script & class support
│   └── ParseException.java        # Syntax error with line and column reporting
├── runtime/
│   ├── RuntimeValue.java          # Polymorphic representation of primitive, reference, or null values
│   ├── HeapObject.java            # Simulated heap-allocated class instance with field map
│   ├── HeapArray.java             # Simulated heap-allocated array with element list
│   └── StackFrame.java            # Active method invocation activation record
├── errors/
│   ├── SimulationException.java   # Base simulation runtime exception
│   ├── NullPointerSimulationException.java
│   ├── ArithmeticSimulationException.java
│   ├── ArrayIndexOutOfBoundsSimulationException.java
│   ├── ExecutionLimitException.java
│   └── FailureForensics.java      # Deterministic root-cause analyzer & remediation generator
├── trace/
│   ├── EventType.java             # 17 distinct execution lifecycle event kinds
│   ├── ExecutionEvent.java        # Event descriptor with line, type, description, and snapshots
│   ├── ExecutionTrace.java        # Complete execution output container
│   ├── VariableSnapshot.java      # Immutable variable state
│   ├── StackFrameSnapshot.java    # Immutable frame state
│   ├── HeapObjectSnapshot.java    # Immutable object card state
│   └── HeapArraySnapshot.java     # Immutable array state
└── interpreter/
    └── Interpreter.java           # AST visitor, evaluation engine, and watchdog
```

---

## 4. Interpreter Mechanics

### 4.1 Activation Records & Stack Frames
When a program begins execution, the interpreter sets up the initial `main` stack frame. Each method invocation pushes a new `StackFrame` containing:
- `frameId`: Unique monotonically increasing ID.
- `methodName`: Method identifier (e.g., `main`, `study`, `add`).
- `className`: Declaring class name (e.g., `Main`, `Student`).
- `line`: Current line number executing within that frame.
- `localVariables`: Scope-aware map of variable names to `RuntimeValue` instances.
- `returnValue`: Captured return value upon method exit.

When a method finishes execution (either by reaching a `return` statement or the closing brace), its frame is popped from the `Deque<StackFrame>`.

### 4.2 Heap Management & References
Objects are instantiated via `new ClassName(arguments...)`:
1. An integer ID is assigned (e.g., `1`, `2`, `17`).
2. Fields declared on the class are initialized to default values (0, 0.0, false, or null).
3. The constructor `ClassName(...)` is invoked with a hidden `this` variable bound to `RuntimeValue.objectRef(objectId, className)`.
4. The newly created `HeapObject` is stored in `Map<Integer, HeapObject> heap`.
5. Variables receiving the object do **not** hold the object data directly; they store an object reference `ref(id)` pointing to the heap entry.

### 4.3 Arrays
Arrays are first-class heap citizens modeled via `HeapArray`. Both literal declarations (`int[] a = {1, 2, 3};`) and sized allocations (`int[] a = new int[5];`) instantiate a heap record with stable array IDs, element bounds checking, and element mutation tracking.

---

## 5. Execution Watchdogs & Safety Bounds

To ensure safety and responsiveness, the interpreter enforces strict watchdog thresholds:

| Bound Parameter | Default Limit | Purpose | Error Behavior |
| :--- | :--- | :--- | :--- |
| **Max Execution Steps** | 10,000 steps | Prevents infinite loops / infinite recursion | Throws `ExecutionLimitException` |
| **Max Loop Iterations** | 5,000 iterations | Halts `while(true)` or runaway `for` loops | Throws `ExecutionLimitException` |
| **Max Call Stack Depth** | 100 frames | Prevents stack overflow from unbounded recursion | Throws `ExecutionLimitException` |
| **Max Output Length** | 100 KB | Guards against log memory exhaustion | Truncates additional output |
| **Max Source Size** | 50 KB | Prevents parser memory exhaustion | Rejected during validation |

When a watchdog fires, execution halts gracefully, a `PROGRAM_FAILED` event is recorded, and the Spring Boot server remains completely healthy and responsive.
