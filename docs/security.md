# JVM VISION Security Architecture & Sandboxing Model

## 1. Executive Summary

JVM VISION enforces a **Zero Host Execution** security architecture. Unlike vulnerable online code compilers that compile untrusted code into native binaries or spawn OS-level child processes via `Runtime.getRuntime().exec()` or `ProcessBuilder`, JVM VISION evaluates user code entirely within an **AST-based educational interpreter**.

User-submitted code is never compiled by `javac`, never executed by the host JVM's bytecode engine, and never given direct access to the host operating system, memory, filesystem, or network.

---

## 2. Threat Analysis & Mitigations

### 2.1 Remote Code Execution (RCE) / Command Injection
- **Threat**: Attackers submitting code such as `Runtime.getRuntime().exec("rm -rf /")` or `new ProcessBuilder("cmd.exe").start()`.
- **Mitigation**: The JVM VISION lexer and parser only recognize the educational Java subset. The `Runtime`, `Process`, `System` (other than standard `System.out.println`), `File`, and `Socket` classes are simply unrecognized identifiers with no binding to native Java runtime reflection. Any attempt to invoke these throws a clean `SimulationException`: *"Unknown variable or class 'Runtime'"*.

### 2.2 Denial of Service (DoS) via Infinite Loops
- **Threat**: Submitting `while (true) {}` or `for (;;) {}` to consume 100% server CPU.
- **Mitigation**: The interpreter includes an execution watchdog that tracks total execution steps and loop iterations. If steps exceed `10,000` or a single loop exceeds `5,000` iterations, an `ExecutionLimitException` is thrown immediately, terminating simulation in under 15 milliseconds.

### 2.3 Stack Overflow via Infinite Recursion
- **Threat**: Submitting infinite recursive calls `void f() { f(); }` to exhaust JVM thread stack memory.
- **Mitigation**: The interpreter measures the simulated call stack depth. If `callStack.size() >= 100`, the interpreter terminates execution and records an `ExecutionLimitException` without crashing the host Spring Boot thread.

### 2.4 Memory Exhaustion via Massive Allocations
- **Threat**: Submitting `int[] a = new int[Integer.MAX_VALUE];` to induce host `OutOfMemoryError`.
- **Mitigation**: Array creations are bounded to a maximum size of 1,000 elements. Allocations exceeding this threshold are rejected at interpretation time.

### 2.5 SQL Injection
- **Threat**: Submitting malicious SQL payload strings in session titles or search filters.
- **Mitigation**: All database operations use Spring `JdbcTemplate` with parameterized queries (`PreparedStatement`). No dynamic string concatenation is ever performed against SQL statements.

### 2.6 Cross-Origin Resource Sharing (CORS) Isolation
- **Threat**: Malicious third-party websites executing unauthorized requests against the execution API.
- **Mitigation**: Spring Security / Web CORS configuration specifies explicit allowed origins (`cors.allowed-origin`), disallowing wildcard `*` origins when credentials are in use.

---

## 3. Sandboxing Verification Matrix

| Attack Vector | Malicious Input Example | JVM VISION Defense | Result |
| :--- | :--- | :--- | :--- |
| **OS Command Exec** | `Runtime.getRuntime().exec(...)` | Not in supported AST symbol table | Syntax/Interpreter error: Unknown symbol |
| **Infinite Loop** | `while(true) {}` | Watchdog counter (`limit = 5,000`) | Halted cleanly with `ExecutionLimitException` |
| **Stack Overflow** | `int recurse() { return recurse(); }` | Call stack depth limit (`depth = 100`) | Halted cleanly with `ExecutionLimitException` |
| **Filesystem Read** | `new FileInputStream("/etc/passwd")` | Class unrecognized by AST parser | Parser error: Unsupported class |
| **SQL Injection** | `Session Title: '; DROP TABLE sessions;--` | Spring `JdbcTemplate` prepared statements | Safely escaped as string literal parameter |
