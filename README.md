# JVM VISION

### Interactive Java Runtime Visualization & Failure Analysis Platform

> **"See what your Java program actually does."**  
> *Write code. Watch it come alive.*

![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)
![Database](https://img.shields.io/badge/Database-Spring%20JDBC%20%2B%20PostgreSQL%20%2F%20H2-lightgrey.svg)
![License](https://img.shields.io/badge/Academic-Full%20Stack%20Java%20Project-success.svg)

---

## 1. What is JVM VISION?

**JVM VISION** is an interactive educational platform that allows students, educators, and software engineers to enter a controlled subset of Java code and visually observe what happens while the program executes in real time.

Instead of merely displaying static console text:
```text
Hello World
```
JVM VISION visualizes the live, moving machinery of execution:
```text
SOURCE CODE
      ↓
CURRENT EXECUTION LINE
      ↓
CALL STACK
      ↓
LOCAL VARIABLES
      ↓
HEAP / OBJECTS
      ↓
PROGRAM OUTPUT
      ↓
EXECUTION TIMELINE
```

---

## 2. Why Does It Exist?

Learning Java is often impeded by an invisible barrier: students struggle to build an accurate mental model of the difference between **primitive values on the stack** and **objects on the heap**, how **method invocation pushes activation records**, and why a **null dereference** causes a `NullPointerException`.

Traditional debuggers are cluttered with thousands of JVM internals, thread pools, and bytecode offsets that overwhelm beginners. JVM VISION strips away cognitive noise and provides a clean, visual microscope into code execution:
1. When `Student s = new Student("Zaid");` runs, you watch an object card appear on the heap, the constructor frame push onto the stack, fields initialize, and a reference pointer connect `s` to `Object #1`.
2. When an exception occurs, the system doesn't just crash with a cryptic stack trace; it diagnoses the root cause deterministically and offers interactive **Failure Replay**.
3. With **Time-Travel Scrubbing**, you can drag the execution timeline backward to observe how heap objects and stack frames change across time.

---

## 3. Supported Java Subset

JVM VISION intentionally uses an educational execution simulator rather than a production JVM compiler to ensure 100% host security and granular event generation. The supported MVP subset includes:

| Category | Supported Constructs |
| :--- | :--- |
| **Primitives & Types** | `int`, `double`, `boolean`, `String`, `void`, custom class types |
| **Variables** | Declarations (`int x = 10;`), assignments (`x = 20;`), compound operators (`+=`, `-=`, `*=`, `/=`) |
| **Arithmetic & Logic** | `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `\|\|`, `!`, `++`, `--` |
| **Control Flow** | `if` / `else if` / `else`, `while (...)`, `for (...)` |
| **Methods & Returns** | Static and instance methods, parameters, return values, recursion |
| **OOP & Heap** | `class`, `new ClassName(...)`, constructors, `this`, field access (`obj.field`), instance mutation |
| **Arrays** | Initializer lists (`int[] arr = {1, 2, 3};`), dynamic size (`new int[5]`), indexing (`arr[0]`) |
| **Exceptions** | `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`, `try` / `catch` |
| **Console Output** | `System.out.println(...)` with string and primitive concatenation |

*Unsupported syntax (e.g. lambda expressions, reflections, external network/file I/O) is rejected with clear diagnostic guidance.*

---

## 4. System Architecture

```text
                           JVM VISION
                                │
                     ┌──────────▼──────────┐
                     │     React UI        │
                     │  Interactive IDE    │
                     └──────────┬──────────┘
                                │ HTTP / REST
                     ┌──────────▼──────────┐
                     │    Spring Boot      │
                     │   Java Backend      │
                     └──────────┬──────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Java Simulation    │
                     │   / Interpreter     │
                     └──────────┬──────────┘
                                │
                         Execution Trace
                                │
                     ┌──────────▼──────────┐
                     │       React         │
                     │ Runtime Visualizer  │
                     └─────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Spring JDBC / H2   │
                     │  (PostgreSQL Prod)  │
                     └─────────────────────┘
```

---

## 5. Quick Start (Run Locally in 60 Seconds)

### Prerequisites
- **Java 21** or later (`java -version`)
- **Node.js 18+** & `npm` (for frontend development)
- **Maven 3.8+** (included in repository via `.tools/`)

### Option A: Run the Prebuilt All-in-One Standalone JAR
```cmd
java -jar jvm-vision.jar
```
Open **`http://localhost:8080`** in your web browser. That's it! Both the React visualizer and Spring Boot backend are running.

### Option B: Build and Run from Source
```cmd
# 1. Build the complete project (Frontend + Backend + JAR)
scripts\build.bat

# 2. Run the newly built fat JAR
scripts\run-backend.bat
```

### Option C: Independent Frontend Dev Server (with Hot Reload)
```cmd
# Terminal 1: Start Spring Boot REST API
scripts\run-backend.bat

# Terminal 2: Start Vite Dev Server
scripts\run-frontend.bat
```
Visit `http://localhost:5173` (Vite proxies requests to Spring Boot on `8080`).

---

## 6. Flagship Demos to Try

### 1. Object Creation & Method Lifecycle (The Main Showcase)
Load **"Student Object Demo"** in the Visualizer:
```java
class Student {
    String name;
    int marks;

    Student(String name) {
        this.name = name;
        this.marks = 0;
    }

    void study() {
        marks = marks + 10;
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student("Zaid");
        student.study();
        System.out.println(student.marks);
    }
}
```
**What happens**:
1. `new Student("Zaid")` instantiates `Object #1` on the Heap.
2. The constructor pushes onto the Call Stack and initializes `name` and `marks`.
3. `student.study()` pushes the `study()` frame and increments `marks` from `0 → 10`.
4. The return unwinds the stack frame.
5. Console displays `10`.

---

### 2. Failure Forensics & Crash Replay
Load **"NullPointerException Demo"**:
```java
class Student {
    String name;
}

class Main {
    public static void main(String[] args) {
        Student student = null;
        System.out.println(student.name);
    }
}
```
**What happens**:
1. The program executes line 7 (`student = null`).
2. At line 8, field access on null triggers a simulated `NullPointerException`.
3. The UI smoothly transitions into **Runtime Failure Mode**.
4. The **Failure Forensics Panel** diagnoses the exact null reference (`student`) and offers actionable advice on how to fix it.
5. Clicking **Replay Failure** walks through the crash progression step-by-step.

---

## 7. How the Interpreter & Execution Traces Work

1. **Tokenization (`Lexer.java`)**: Converts Java source text into typed `Token` objects with line and column numbers.
2. **Parsing (`Parser.java`)**: Builds a strongly-typed AST using recursive descent. Supports both full classes and top-level educational scripts.
3. **Interpretation (`Interpreter.java`)**: Traverses the AST in a controlled environment. Maintains a simulated `callStack` and `heap`.
4. **Trace Recording (`ExecutionTrace.java`)**: After every statement, method entry/exit, or heap mutation, an immutable snapshot of all stack frames, local variables, and heap objects is recorded in an `ExecutionEvent`.
5. **Time-Travel Scrubbing**: Because every event snapshot is self-contained and immutable, scrubbing to any event index `k` updates the entire React UI in $O(1)$ time with zero recalculation lag.

---

## 8. Security & Watchdog Limits

To prevent arbitrary execution and malicious attacks on the host server:
- **No Native Execution**: Never invokes `Runtime.exec()`, `ProcessBuilder`, or dynamic bytecode compilers.
- **Execution Step Limit**: Max 10,000 steps per program.
- **Loop Iteration Limit**: Max 5,000 iterations per loop (prevents `while(true)` hangs).
- **Call Stack Limit**: Max 100 frames (prevents runaway recursion).
- **SQL Injection Prevention**: 100% parameterized queries via Spring `JdbcTemplate`.

---

## 9. Technical Documentation Index

Detailed engineering documentation is available in the [`docs/`](file:///docs/) directory:
- [Architecture & System Design](file:///docs/architecture.md)
- [Execution Engine & Pipeline](file:///docs/execution-engine.md)
- [Parser & Supported Java Grammar](file:///docs/parser.md)
- [Runtime Memory Model](file:///docs/runtime-model.md)
- [Execution Trace & Snapshot Format](file:///docs/trace-format.md)
- [REST API Specification](file:///docs/api.md)
- [Database & JDBC Schema](file:///docs/database.md)
- [Production Deployment Guide](file:///docs/deployment.md)
- [Security & Sandboxing Architecture](file:///docs/security.md)
- [Academic Viva Defense Notes](file:///docs/viva-notes.md)

---

## 10. License & Academic Attribution
Developed as a Full-Stack Java Programming Academic Project. Built with clean OOP principles, Spring Boot, Spring JDBC, and React.
