package com.jvmvision;

import com.jvmvision.engine.ast.ProgramNode;
import com.jvmvision.engine.interpreter.Interpreter;
import com.jvmvision.engine.lexer.Lexer;
import com.jvmvision.engine.lexer.Token;
import com.jvmvision.engine.parser.Parser;
import com.jvmvision.engine.trace.EventType;
import com.jvmvision.engine.trace.ExecutionTrace;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class InterpreterTest {

    private ExecutionTrace run(String code) {
        Lexer lexer = new Lexer(code);
        List<Token> tokens = lexer.scanTokens();
        Parser parser = new Parser(tokens);
        ProgramNode program = parser.parse();
        Interpreter interpreter = new Interpreter(program, 1000, 500, 50, 1024);
        return interpreter.execute("test-session");
    }

    @Test
    void testFlagshipObjectCreationAndMethodCall() {
        String code = "class Student {\n" +
                      "    String name;\n" +
                      "    int marks;\n" +
                      "    Student(String name) {\n" +
                      "        this.name = name;\n" +
                      "        this.marks = 0;\n" +
                      "    }\n" +
                      "    void study() {\n" +
                      "        marks = marks + 10;\n" +
                      "    }\n" +
                      "}\n" +
                      "class Main {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        Student student = new Student(\"Zaid\");\n" +
                      "        student.study();\n" +
                      "        System.out.println(student.marks);\n" +
                      "    }\n" +
                      "}";

        ExecutionTrace trace = run(code);
        assertEquals("COMPLETED", trace.getStatus());
        assertTrue(trace.getTotalEvents() > 5);

        boolean foundObjectCreated = trace.getEvents().stream()
                .anyMatch(e -> e.getEventType() == EventType.OBJECT_CREATED);
        boolean foundMethodEnter = trace.getEvents().stream()
                .anyMatch(e -> e.getEventType() == EventType.METHOD_ENTER);
        boolean foundFieldChanged = trace.getEvents().stream()
                .anyMatch(e -> e.getEventType() == EventType.FIELD_CHANGED);
        boolean foundOutputWritten = trace.getEvents().stream()
                .anyMatch(e -> e.getEventType() == EventType.OUTPUT_WRITTEN);

        assertTrue(foundObjectCreated, "OBJECT_CREATED event should exist");
        assertTrue(foundMethodEnter, "METHOD_ENTER event should exist");
        assertTrue(foundFieldChanged, "FIELD_CHANGED event should exist");
        assertTrue(foundOutputWritten, "OUTPUT_WRITTEN event should exist");
    }

    @Test
    void testNullPointerExceptionCrash() {
        String code = "class Student {\n" +
                      "    String name;\n" +
                      "}\n" +
                      "class Main {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        Student student = null;\n" +
                      "        System.out.println(student.name);\n" +
                      "    }\n" +
                      "}";

        ExecutionTrace trace = run(code);
        assertEquals("FAILED", trace.getStatus());
        assertEquals("NullPointerException", trace.getErrorType());
        assertNotNull(trace.getFailureForensics());
        assertEquals("student", trace.getFailureForensics().get("reference"));
    }

    @Test
    void testDivisionByZeroCrash() {
        String code = "class Main {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        int x = 10 / 0;\n" +
                      "    }\n" +
                      "}";

        ExecutionTrace trace = run(code);
        assertEquals("FAILED", trace.getStatus());
        assertEquals("ArithmeticException", trace.getErrorType());
    }

    @Test
    void testInfiniteLoopProtection() {
        String code = "class Main {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        while (true) {\n" +
                      "        }\n" +
                      "    }\n" +
                      "}";

        ExecutionTrace trace = run(code);
        assertEquals("FAILED", trace.getStatus());
        assertEquals("ExecutionLimitExceeded", trace.getErrorType());
    }
}
