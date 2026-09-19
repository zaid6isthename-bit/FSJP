package com.jvmvision;

import com.jvmvision.engine.ast.ClassNode;
import com.jvmvision.engine.ast.ProgramNode;
import com.jvmvision.engine.lexer.Lexer;
import com.jvmvision.engine.lexer.Token;
import com.jvmvision.engine.parser.Parser;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ParserTest {

    @Test
    void testParseFullClass() {
        String code = "class Student {\n" +
                      "    String name;\n" +
                      "    int marks;\n" +
                      "    Student(String name) {\n" +
                      "        this.name = name;\n" +
                      "    }\n" +
                      "    void study() {\n" +
                      "        marks = marks + 10;\n" +
                      "    }\n" +
                      "}\n";

        Lexer lexer = new Lexer(code);
        List<Token> tokens = lexer.scanTokens();
        Parser parser = new Parser(tokens);
        ProgramNode program = parser.parse();

        assertNotNull(program);
        assertEquals(1, program.getClasses().size());
        ClassNode cls = program.getClasses().get(0);
        assertEquals("Student", cls.getName());
        assertEquals(2, cls.getFields().size());
        assertEquals(1, cls.getConstructors().size());
        assertEquals(1, cls.getMethods().size());
    }

    @Test
    void testParseTopLevelScriptWrappedAsMain() {
        String code = "int x = 10;\nint y = 20;\nint sum = x + y;\n";
        Lexer lexer = new Lexer(code);
        List<Token> tokens = lexer.scanTokens();
        Parser parser = new Parser(tokens);
        ProgramNode program = parser.parse();

        assertNotNull(program);
        assertEquals(1, program.getClasses().size());
        ClassNode mainClass = program.findMainClass();
        assertNotNull(mainClass);
        assertEquals("Main", mainClass.getName());
    }
}
