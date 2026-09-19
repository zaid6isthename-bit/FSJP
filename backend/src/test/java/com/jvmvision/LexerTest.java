package com.jvmvision;

import com.jvmvision.engine.lexer.Lexer;
import com.jvmvision.engine.lexer.Token;
import com.jvmvision.engine.lexer.TokenType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class LexerTest {

    @Test
    void testBasicTokenScanning() {
        String source = "int x = 10; // comment\nString name = \"Zaid\";";
        Lexer lexer = new Lexer(source);
        List<Token> tokens = lexer.scanTokens();

        assertNotNull(tokens);
        assertEquals(TokenType.INT, tokens.get(0).getType());
        assertEquals("x", tokens.get(1).getLexeme());
        assertEquals(TokenType.ASSIGN, tokens.get(2).getType());
        assertEquals(10, tokens.get(3).getLiteral());
        assertEquals(TokenType.SEMICOLON, tokens.get(4).getType());

        assertEquals(TokenType.STRING, tokens.get(5).getType());
        assertEquals("name", tokens.get(6).getLexeme());
        assertEquals(TokenType.ASSIGN, tokens.get(7).getType());
        assertEquals("Zaid", tokens.get(8).getLiteral());
    }

    @Test
    void testOperatorsAndSymbols() {
        String source = "x++; y += 5; (a == b && c != d);";
        Lexer lexer = new Lexer(source);
        List<Token> tokens = lexer.scanTokens();

        assertTrue(tokens.stream().anyMatch(t -> t.getType() == TokenType.PLUS_PLUS));
        assertTrue(tokens.stream().anyMatch(t -> t.getType() == TokenType.PLUS_ASSIGN));
        assertTrue(tokens.stream().anyMatch(t -> t.getType() == TokenType.EQUAL));
        assertTrue(tokens.stream().anyMatch(t -> t.getType() == TokenType.AND));
        assertTrue(tokens.stream().anyMatch(t -> t.getType() == TokenType.NOT_EQUAL));
    }
}
