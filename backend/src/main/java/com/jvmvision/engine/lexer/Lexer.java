package com.jvmvision.engine.lexer;

import java.util.*;

public class Lexer {
    private final String source;
    private final List<Token> tokens = new ArrayList<>();
    private int start = 0;
    private int current = 0;
    private int line = 1;
    private int column = 1;
    private int tokenStartColumn = 1;

    private static final Map<String, TokenType> KEYWORDS = new HashMap<>();

    static {
        KEYWORDS.put("class", TokenType.CLASS);
        KEYWORDS.put("public", TokenType.PUBLIC);
        KEYWORDS.put("private", TokenType.PRIVATE);
        KEYWORDS.put("protected", TokenType.PROTECTED);
        KEYWORDS.put("static", TokenType.STATIC);
        KEYWORDS.put("void", TokenType.VOID);
        KEYWORDS.put("int", TokenType.INT);
        KEYWORDS.put("double", TokenType.DOUBLE);
        KEYWORDS.put("boolean", TokenType.BOOLEAN);
        KEYWORDS.put("String", TokenType.STRING);
        KEYWORDS.put("if", TokenType.IF);
        KEYWORDS.put("else", TokenType.ELSE);
        KEYWORDS.put("for", TokenType.FOR);
        KEYWORDS.put("while", TokenType.WHILE);
        KEYWORDS.put("return", TokenType.RETURN);
        KEYWORDS.put("new", TokenType.NEW);
        KEYWORDS.put("null", TokenType.NULL);
        KEYWORDS.put("true", TokenType.TRUE);
        KEYWORDS.put("false", TokenType.FALSE);
        KEYWORDS.put("try", TokenType.TRY);
        KEYWORDS.put("catch", TokenType.CATCH);
        KEYWORDS.put("throw", TokenType.THROW);
        KEYWORDS.put("extends", TokenType.EXTENDS);
        KEYWORDS.put("this", TokenType.THIS);
    }

    public Lexer(String source) {
        this.source = source != null ? source : "";
    }

    public List<Token> scanTokens() {
        while (!isAtEnd()) {
            start = current;
            tokenStartColumn = column;
            scanToken();
        }

        tokens.add(new Token(TokenType.EOF, "", null, line, column));
        return tokens;
    }

    private void scanToken() {
        char c = advance();
        switch (c) {
            case '{': addToken(TokenType.LBRACE); break;
            case '}': addToken(TokenType.RBRACE); break;
            case '(': addToken(TokenType.LPAREN); break;
            case ')': addToken(TokenType.RPAREN); break;
            case '[': addToken(TokenType.LBRACKET); break;
            case ']': addToken(TokenType.RBRACKET); break;
            case ';': addToken(TokenType.SEMICOLON); break;
            case ',': addToken(TokenType.COMMA); break;
            case '.': addToken(TokenType.DOT); break;
            case '+':
                if (match('+')) addToken(TokenType.PLUS_PLUS);
                else if (match('=')) addToken(TokenType.PLUS_ASSIGN);
                else addToken(TokenType.PLUS);
                break;
            case '-':
                if (match('-')) addToken(TokenType.MINUS_MINUS);
                else if (match('=')) addToken(TokenType.MINUS_ASSIGN);
                else addToken(TokenType.MINUS);
                break;
            case '*': addToken(TokenType.STAR); break;
            case '%': addToken(TokenType.PERCENT); break;
            case '/':
                if (match('/')) {
                    // Line comment: consume until newline
                    while (peek() != '\n' && !isAtEnd()) advance();
                } else if (match('*')) {
                    // Block comment: consume until */
                    blockComment();
                } else {
                    addToken(TokenType.SLASH);
                }
                break;
            case '!':
                addToken(match('=') ? TokenType.NOT_EQUAL : TokenType.NOT);
                break;
            case '=':
                addToken(match('=') ? TokenType.EQUAL : TokenType.ASSIGN);
                break;
            case '<':
                addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '&':
                if (match('&')) {
                    addToken(TokenType.AND);
                } else {
                    throw new RuntimeException("Line " + line + ", col " + tokenStartColumn + ": Bitwise '&' is not supported in JVM VISION. Did you mean '&&'?");
                }
                break;
            case '|':
                if (match('|')) {
                    addToken(TokenType.OR);
                } else {
                    throw new RuntimeException("Line " + line + ", col " + tokenStartColumn + ": Bitwise '|' is not supported in JVM VISION. Did you mean '||'?");
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace
                break;
            case '\n':
                line++;
                column = 1;
                break;
            case '"':
                string();
                break;
            default:
                if (isDigit(c)) {
                    number();
                } else if (isAlpha(c)) {
                    identifier();
                } else {
                    throw new RuntimeException("Line " + line + ", col " + tokenStartColumn + ": Unexpected character '" + c + "'");
                }
                break;
        }
    }

    private void blockComment() {
        while (!isAtEnd()) {
            if (peek() == '*' && peekNext() == '/') {
                advance(); // consume '*'
                advance(); // consume '/'
                return;
            }
            if (peek() == '\n') {
                line++;
                column = 0;
            }
            advance();
        }
        throw new RuntimeException("Line " + line + ": Unterminated block comment");
    }

    private void string() {
        StringBuilder sb = new StringBuilder();
        while (peek() != '"' && !isAtEnd()) {
            if (peek() == '\n') {
                line++;
                column = 0;
            }
            if (peek() == '\\') {
                advance();
                char escape = advance();
                switch (escape) {
                    case 'n': sb.append('\n'); break;
                    case 't': sb.append('\t'); break;
                    case 'r': sb.append('\r'); break;
                    case '\\': sb.append('\\'); break;
                    case '"': sb.append('"'); break;
                    default: sb.append(escape); break;
                }
            } else {
                sb.append(advance());
            }
        }

        if (isAtEnd()) {
            throw new RuntimeException("Line " + line + ", col " + tokenStartColumn + ": Unterminated string literal");
        }

        advance(); // Closing quote
        String value = sb.toString();
        addToken(TokenType.STRING_LITERAL, value);
    }

    private void number() {
        while (isDigit(peek())) advance();

        if (peek() == '.' && isDigit(peekNext())) {
            advance(); // consume '.'
            while (isDigit(peek())) advance();
            double value = Double.parseDouble(source.substring(start, current));
            addToken(TokenType.DOUBLE_LITERAL, value);
        } else {
            long value = Long.parseLong(source.substring(start, current));
            addToken(TokenType.INTEGER_LITERAL, (int) value);
        }
    }

    private void identifier() {
        while (isAlphaNumeric(peek())) advance();

        String text = source.substring(start, current);
        TokenType type = KEYWORDS.get(text);
        if (type == null) {
            type = TokenType.IDENTIFIER;
        } else if (type == TokenType.TRUE) {
            addToken(TokenType.TRUE, true);
            return;
        } else if (type == TokenType.FALSE) {
            addToken(TokenType.FALSE, false);
            return;
        } else if (type == TokenType.NULL) {
            addToken(TokenType.NULL, null);
            return;
        }

        addToken(type);
    }

    private boolean match(char expected) {
        if (isAtEnd()) return false;
        if (source.charAt(current) != expected) return false;

        current++;
        column++;
        return true;
    }

    private char peek() {
        if (isAtEnd()) return '\0';
        return source.charAt(current);
    }

    private char peekNext() {
        if (current + 1 >= source.length()) return '\0';
        return source.charAt(current + 1);
    }

    private boolean isAlpha(char c) {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
                c == '_';
    }

    private boolean isAlphaNumeric(char c) {
        return isAlpha(c) || isDigit(c);
    }

    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    private boolean isAtEnd() {
        return current >= source.length();
    }

    private char advance() {
        char c = source.charAt(current++);
        column++;
        return c;
    }

    private void addToken(TokenType type) {
        addToken(type, null);
    }

    private void addToken(TokenType type, Object literal) {
        String text = source.substring(start, current);
        tokens.add(new Token(type, text, literal, line, tokenStartColumn));
    }
}
