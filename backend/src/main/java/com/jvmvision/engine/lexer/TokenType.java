package com.jvmvision.engine.lexer;

public enum TokenType {
    // Keywords
    CLASS, PUBLIC, PRIVATE, PROTECTED, STATIC, VOID,
    INT, DOUBLE, BOOLEAN, STRING,
    IF, ELSE, FOR, WHILE, RETURN, NEW, NULL, TRUE, FALSE,
    TRY, CATCH, THROW, EXTENDS, THIS,

    // Identifiers & Literals
    IDENTIFIER,
    INTEGER_LITERAL,
    DOUBLE_LITERAL,
    STRING_LITERAL,

    // Separators & Delimiters
    LBRACE,        // {
    RBRACE,        // }
    LPAREN,        // (
    RPAREN,        // )
    LBRACKET,      // [
    RBRACKET,      // ]
    SEMICOLON,     // ;
    COMMA,         // ,
    DOT,           // .

    // Operators
    ASSIGN,        // =
    PLUS,          // +
    MINUS,         // -
    STAR,          // *
    SLASH,         // /
    PERCENT,       // %
    PLUS_PLUS,     // ++
    MINUS_MINUS,   // --
    PLUS_ASSIGN,   // +=
    MINUS_ASSIGN,  // -=
    EQUAL,         // ==
    NOT_EQUAL,     // !=
    LESS,          // <
    GREATER,       // >
    LESS_EQUAL,    // <=
    GREATER_EQUAL, // >=
    AND,           // &&
    OR,            // ||
    NOT,           // !

    // End of File
    EOF
}
