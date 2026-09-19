# JVM VISION Architecture & System Design

## 1. Executive Summary

**JVM VISION** is an interactive educational platform that allows students and developers to enter a controlled subset of Java code and visually explore runtime execution in real time. Instead of merely viewing console text output, users observe how source lines map directly to:
- Call Stack frames (method invocations, parameters, and returns)
- Local Variables (primitives and heap references)
- Heap Memory (dynamically allocated objects, fields, and arrays)
- Program Output (streaming stdout)
- Execution Timeline (bidirectional time-travel scrubbing)
- Failure Forensics (deterministic root-cause analysis for exceptions)

---

## 2. Core Architectural Philosophy

1. **Educational Simulation over JVM Bytecode**:
   JVM VISION does **not** run arbitrary Java on the host OS via `Runtime.exec` or dynamic compilation. It uses a custom-built Java tokenizer, recursive descent parser, and sandboxed AST interpreter. This provides zero server-side code execution vulnerabilities and allows complete introspection at every execution step.
2. **Immutable Snapshot Time-Travel**:
   Every execution event captures an immutable snapshot of the Call Stack, Heap Objects, and Local Variables. The React frontend can travel backward and forward across thousands of steps with zero recalculation latency.
3. **Deterministic Failure Forensics**:
   When an exception occurs (such as `NullPointerException` or `ArithmeticException`), a rule-based forensic analyzer diagnoses the exact null reference or zero divisor and generates actionable remediation guidance without calling external AI APIs.

---

## 3. High-Level System Diagram

```text
                           JVM VISION
                               │
                    ┌──────────▼──────────┐
                    │     React UI        │
                    │  Interactive IDE    │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
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
```

---

## 4. Layered Component Breakdown

### Frontend Presentation Layer (`frontend/`)
- Built with **React 19**, **Vite**, and **Tailwind CSS**.
- **CodeEditor**: Monaco-grade code editor with synchronized line execution highlighting and error badges.
- **CallStack**: Animated visual stack showing pushed/popped frames and parameters.
- **HeapView**: Dynamic object cards with stable object IDs (`Object #1`), field mutation pulses, and array allocations.
- **VariablesPanel**: Real-time inspection of current stack frame variables with object reference pills.
- **OutputConsole**: Real-time terminal output stream.
- **TimelineScrubber**: Interactive scrub bar supporting instantaneous bidirectional time travel.
- **FailureForensicsPanel**: Detailed failure breakdown and one-click "Replay Failure" sequence.

### API & Service Layer (`com.jvmvision.controller`, `com.jvmvision.service`)
- Clean versioned REST endpoints (`/api/execution/run`, `/api/execution/validate`, `/api/examples`, `/api/sessions`).
- Unified response envelope `ApiResponse<T>`.
- Global exception handler mapping parsing and simulation errors to structured HTTP responses.

### Educational Execution Engine (`com.jvmvision.engine`)
- **`lexer/`**: Tokenizer scanning keywords, identifiers, literals, and operators with exact line/column tracking.
- **`parser/`**: Recursive descent parser building the Abstract Syntax Tree.
- **`ast/`**: Strongly typed AST hierarchy retaining source coordinates for every node.
- **`interpreter/`**: Sandboxed AST visitor evaluating statements, expressions, and memory mutations under strict watchdog limits.
- **`trace/`**: Event recorder generating deep immutable snapshots at every step.
- **`errors/`**: Specialized simulation exceptions and rule-based failure forensics.

### Persistence Layer (`com.jvmvision.repository`)
- Explicit Spring `JdbcTemplate` implementation without Hibernate/JPA magic.
- Parameterized SQL queries preventing SQL injection.
- Schema compatible with both PostgreSQL (production) and H2 (local development).
