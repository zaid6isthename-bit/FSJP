package com.jvmvision.engine.parser;

import com.jvmvision.engine.ast.*;
import com.jvmvision.engine.lexer.Token;
import com.jvmvision.engine.lexer.TokenType;

import java.util.*;

public class Parser {
    private final List<Token> tokens;
    private int current = 0;

    public Parser(List<Token> tokens) {
        this.tokens = tokens != null ? tokens : Collections.emptyList();
    }

    public ProgramNode parse() {
        // If the code doesn't start with 'class' or modifier + 'class', wrap statements in a synthetic Main class
        if (!isClassDeclarationStart()) {
            return parseScriptAsMainClass();
        }

        List<ClassNode> classes = new ArrayList<>();
        while (!isAtEnd()) {
            classes.add(parseClass());
        }

        int line = classes.isEmpty() ? 1 : classes.get(0).getLine();
        int col = classes.isEmpty() ? 1 : classes.get(0).getColumn();
        return new ProgramNode(line, col, classes);
    }

    private boolean isClassDeclarationStart() {
        int lookahead = current;
        while (lookahead < tokens.size()) {
            TokenType t = tokens.get(lookahead).getType();
            if (t == TokenType.PUBLIC || t == TokenType.PRIVATE || t == TokenType.PROTECTED || t == TokenType.STATIC) {
                lookahead++;
            } else if (t == TokenType.CLASS) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    private ProgramNode parseScriptAsMainClass() {
        int startLine = peek().getLine();
        int startCol = peek().getColumn();

        List<StatementNode> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(parseStatement());
        }

        BlockNode body = new BlockNode(startLine, startCol, statements);
        List<ParameterNode> params = Collections.singletonList(
                new ParameterNode(startLine, startCol, "String[]", "args")
        );
        MethodNode mainMethod = new MethodNode(startLine, startCol, "void", "main", true, params, body);

        ClassNode mainClass = new ClassNode(startLine, startCol, "Main", null,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.singletonList(mainMethod)
        );

        return new ProgramNode(startLine, startCol, Collections.singletonList(mainClass));
    }

    private ClassNode parseClass() {
        // Optional access modifiers
        while (match(TokenType.PUBLIC, TokenType.PRIVATE, TokenType.PROTECTED)) {
            // consume
        }

        Token classToken = consume(TokenType.CLASS, "Expected 'class' keyword");
        Token nameToken = consume(TokenType.IDENTIFIER, "Expected class name");

        String superClassName = null;
        if (match(TokenType.EXTENDS)) {
            superClassName = consume(TokenType.IDENTIFIER, "Expected superclass name after 'extends'").getLexeme();
        }

        consume(TokenType.LBRACE, "Expected '{' before class body");

        List<FieldDeclarationNode> fields = new ArrayList<>();
        List<ConstructorNode> constructors = new ArrayList<>();
        List<MethodNode> methods = new ArrayList<>();

        while (!check(TokenType.RBRACE) && !isAtEnd()) {
            parseClassMember(nameToken.getLexeme(), fields, constructors, methods);
        }

        consume(TokenType.RBRACE, "Expected '}' after class body");

        return new ClassNode(classToken.getLine(), classToken.getColumn(),
                nameToken.getLexeme(), superClassName, fields, constructors, methods);
    }

    private void parseClassMember(String currentClassName,
                                  List<FieldDeclarationNode> fields,
                                  List<ConstructorNode> constructors,
                                  List<MethodNode> methods) {
        // Optional access modifiers
        while (match(TokenType.PUBLIC, TokenType.PRIVATE, TokenType.PROTECTED)) {
            // consume
        }

        boolean isStatic = false;
        if (match(TokenType.STATIC)) {
            isStatic = true;
        }

        // Check if constructor: className ( ... ) { ... }
        if (check(TokenType.IDENTIFIER) && peek().getLexeme().equals(currentClassName) && peekNext().getType() == TokenType.LPAREN) {
            Token nameToken = advance();
            List<ParameterNode> params = parseParameters();
            BlockNode body = parseBlock();
            constructors.add(new ConstructorNode(nameToken.getLine(), nameToken.getColumn(), currentClassName, params, body));
            return;
        }

        // Otherwise it's either a method or a field: Type name ...
        String type = parseTypeName();
        Token nameToken = consume(TokenType.IDENTIFIER, "Expected member name");

        if (match(TokenType.LPAREN)) {
            // Method declaration
            List<ParameterNode> params = parseParametersAfterOpenParen();
            BlockNode body = parseBlock();
            methods.add(new MethodNode(nameToken.getLine(), nameToken.getColumn(), type, nameToken.getLexeme(), isStatic, params, body));
        } else {
            // Field declaration
            ExpressionNode initializer = null;
            if (match(TokenType.ASSIGN)) {
                initializer = parseExpression();
            }
            consume(TokenType.SEMICOLON, "Expected ';' after field declaration");
            fields.add(new FieldDeclarationNode(nameToken.getLine(), nameToken.getColumn(), type, nameToken.getLexeme(), initializer));
        }
    }

    private List<ParameterNode> parseParameters() {
        consume(TokenType.LPAREN, "Expected '(' for parameter list");
        return parseParametersAfterOpenParen();
    }

    private List<ParameterNode> parseParametersAfterOpenParen() {
        List<ParameterNode> parameters = new ArrayList<>();
        if (!check(TokenType.RPAREN)) {
            do {
                String type = parseTypeName();
                Token name = consume(TokenType.IDENTIFIER, "Expected parameter name");
                parameters.add(new ParameterNode(name.getLine(), name.getColumn(), type, name.getLexeme()));
            } while (match(TokenType.COMMA));
        }
        consume(TokenType.RPAREN, "Expected ')' after parameter list");
        return parameters;
    }

    private String parseTypeName() {
        Token typeToken;
        if (match(TokenType.INT, TokenType.DOUBLE, TokenType.BOOLEAN, TokenType.STRING, TokenType.VOID, TokenType.IDENTIFIER)) {
            typeToken = previous();
        } else {
            throw error(peek(), "Expected type name");
        }

        StringBuilder typeName = new StringBuilder(typeToken.getLexeme());
        while (match(TokenType.LBRACKET)) {
            consume(TokenType.RBRACKET, "Expected ']' for array type");
            typeName.append("[]");
        }
        return typeName.toString();
    }

    private StatementNode parseStatement() {
        if (check(TokenType.LBRACE)) {
            return parseBlock();
        }
        if (match(TokenType.IF)) {
            return parseIfStatement();
        }
        if (match(TokenType.WHILE)) {
            return parseWhileStatement();
        }
        if (match(TokenType.FOR)) {
            return parseForStatement();
        }
        if (match(TokenType.RETURN)) {
            return parseReturnStatement();
        }
        if (match(TokenType.TRY)) {
            return parseTryCatchStatement();
        }
        if (match(TokenType.THROW)) {
            return parseThrowStatement();
        }

        // Check if variable declaration: Type identifier [ = expr ];
        if (isTypeAtCurrent()) {
            return parseVariableDeclaration();
        }

        // Otherwise an expression statement (assignment, method call, increment/decrement)
        return parseExpressionStatement();
    }

    private boolean isTypeAtCurrent() {
        Token token = peek();
        TokenType t = token.getType();
        if (t == TokenType.INT || t == TokenType.DOUBLE || t == TokenType.BOOLEAN || t == TokenType.STRING) {
            return true;
        }

        // If it's an IDENTIFIER followed by brackets or identifier, it might be a class type declaration
        if (t == TokenType.IDENTIFIER) {
            int lookahead = current + 1;
            while (lookahead < tokens.size() && tokens.get(lookahead).getType() == TokenType.LBRACKET) {
                lookahead++;
                if (lookahead < tokens.size() && tokens.get(lookahead).getType() == TokenType.RBRACKET) {
                    lookahead++;
                } else {
                    return false;
                }
            }
            if (lookahead < tokens.size() && tokens.get(lookahead).getType() == TokenType.IDENTIFIER) {
                // e.g. "Student s" or "int[] arr"
                return true;
            }
        }
        return false;
    }

    private VariableDeclarationNode parseVariableDeclaration() {
        int line = peek().getLine();
        int col = peek().getColumn();
        String type = parseTypeName();
        Token nameToken = consume(TokenType.IDENTIFIER, "Expected variable name");

        ExpressionNode initializer = null;
        if (match(TokenType.ASSIGN)) {
            initializer = parseExpression();
        }

        consume(TokenType.SEMICOLON, "Expected ';' after variable declaration");
        return new VariableDeclarationNode(line, col, type, nameToken.getLexeme(), initializer);
    }

    private BlockNode parseBlock() {
        Token brace = consume(TokenType.LBRACE, "Expected '{'");
        List<StatementNode> statements = new ArrayList<>();
        while (!check(TokenType.RBRACE) && !isAtEnd()) {
            statements.add(parseStatement());
        }
        consume(TokenType.RBRACE, "Expected '}' after block");
        return new BlockNode(brace.getLine(), brace.getColumn(), statements);
    }

    private IfNode parseIfStatement() {
        Token ifToken = previous();
        consume(TokenType.LPAREN, "Expected '(' after 'if'");
        ExpressionNode condition = parseExpression();
        consume(TokenType.RPAREN, "Expected ')' after if condition");

        StatementNode thenBranch = parseStatement();
        StatementNode elseBranch = null;
        if (match(TokenType.ELSE)) {
            elseBranch = parseStatement();
        }

        return new IfNode(ifToken.getLine(), ifToken.getColumn(), condition, thenBranch, elseBranch);
    }

    private WhileNode parseWhileStatement() {
        Token whileToken = previous();
        consume(TokenType.LPAREN, "Expected '(' after 'while'");
        ExpressionNode condition = parseExpression();
        consume(TokenType.RPAREN, "Expected ')' after while condition");

        StatementNode body = parseStatement();
        return new WhileNode(whileToken.getLine(), whileToken.getColumn(), condition, body);
    }

    private ForNode parseForStatement() {
        Token forToken = previous();
        consume(TokenType.LPAREN, "Expected '(' after 'for'");

        StatementNode initializer = null;
        if (match(TokenType.SEMICOLON)) {
            initializer = null;
        } else if (isTypeAtCurrent()) {
            initializer = parseVariableDeclaration(); // already consumes semicolon
        } else {
            initializer = parseExpressionStatement(); // already consumes semicolon
        }

        ExpressionNode condition = null;
        if (!check(TokenType.SEMICOLON)) {
            condition = parseExpression();
        }
        consume(TokenType.SEMICOLON, "Expected ';' after for loop condition");

        StatementNode update = null;
        if (!check(TokenType.RPAREN)) {
            ExpressionNode updateExpr = parseExpression();
            update = new ExpressionStatementNode(updateExpr.getLine(), updateExpr.getColumn(), updateExpr);
        }
        consume(TokenType.RPAREN, "Expected ')' after for clauses");

        StatementNode body = parseStatement();
        return new ForNode(forToken.getLine(), forToken.getColumn(), initializer, condition, update, body);
    }

    private ReturnNode parseReturnStatement() {
        Token returnToken = previous();
        ExpressionNode value = null;
        if (!check(TokenType.SEMICOLON)) {
            value = parseExpression();
        }
        consume(TokenType.SEMICOLON, "Expected ';' after return value");
        return new ReturnNode(returnToken.getLine(), returnToken.getColumn(), value);
    }

    private TryCatchNode parseTryCatchStatement() {
        Token tryToken = previous();
        BlockNode tryBlock = parseBlock();

        consume(TokenType.CATCH, "Expected 'catch' after 'try' block");
        consume(TokenType.LPAREN, "Expected '(' after 'catch'");
        String exceptionType = parseTypeName();
        Token exceptionVar = consume(TokenType.IDENTIFIER, "Expected exception variable name");
        consume(TokenType.RPAREN, "Expected ')' after catch parameter");

        BlockNode catchBlock = parseBlock();
        return new TryCatchNode(tryToken.getLine(), tryToken.getColumn(), tryBlock, exceptionType, exceptionVar.getLexeme(), catchBlock);
    }

    private ThrowNode parseThrowStatement() {
        Token throwToken = previous();
        ExpressionNode expr = parseExpression();
        consume(TokenType.SEMICOLON, "Expected ';' after throw expression");
        return new ThrowNode(throwToken.getLine(), throwToken.getColumn(), expr);
    }

    private StatementNode parseExpressionStatement() {
        int line = peek().getLine();
        int col = peek().getColumn();
        ExpressionNode expr = parseExpression();
        consume(TokenType.SEMICOLON, "Expected ';' after expression");
        return new ExpressionStatementNode(line, col, expr);
    }

    public ExpressionNode parseExpression() {
        return parseAssignment();
    }

    private ExpressionNode parseAssignment() {
        ExpressionNode expr = parseLogicalOr();

        if (match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN)) {
            Token equals = previous();
            ExpressionNode value = parseAssignment();
            return new AssignmentNode(equals.getLine(), equals.getColumn(), expr, equals.getLexeme(), value);
        }

        return expr;
    }

    private ExpressionNode parseLogicalOr() {
        ExpressionNode expr = parseLogicalAnd();

        while (match(TokenType.OR)) {
            Token op = previous();
            ExpressionNode right = parseLogicalAnd();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseLogicalAnd() {
        ExpressionNode expr = parseEquality();

        while (match(TokenType.AND)) {
            Token op = previous();
            ExpressionNode right = parseEquality();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseEquality() {
        ExpressionNode expr = parseComparison();

        while (match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
            Token op = previous();
            ExpressionNode right = parseComparison();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseComparison() {
        ExpressionNode expr = parseAdditive();

        while (match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            Token op = previous();
            ExpressionNode right = parseAdditive();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseAdditive() {
        ExpressionNode expr = parseMultiplicative();

        while (match(TokenType.PLUS, TokenType.MINUS)) {
            Token op = previous();
            ExpressionNode right = parseMultiplicative();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseMultiplicative() {
        ExpressionNode expr = parseUnary();

        while (match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
            Token op = previous();
            ExpressionNode right = parseUnary();
            expr = new BinaryExpressionNode(op.getLine(), op.getColumn(), expr, op.getLexeme(), right);
        }

        return expr;
    }

    private ExpressionNode parseUnary() {
        if (match(TokenType.NOT, TokenType.MINUS)) {
            Token op = previous();
            ExpressionNode right = parseUnary();
            return new UnaryExpressionNode(op.getLine(), op.getColumn(), op.getLexeme(), right, true);
        }

        if (match(TokenType.PLUS_PLUS, TokenType.MINUS_MINUS)) {
            Token op = previous();
            ExpressionNode right = parseUnary();
            return new UnaryExpressionNode(op.getLine(), op.getColumn(), op.getLexeme(), right, true);
        }

        return parsePostfix();
    }

    private ExpressionNode parsePostfix() {
        ExpressionNode expr = parsePrimary();

        while (true) {
            if (match(TokenType.DOT)) {
                Token name = consume(TokenType.IDENTIFIER, "Expected field or method name after '.'");
                if (match(TokenType.LPAREN)) {
                    List<ExpressionNode> args = parseArgumentsAfterOpenParen();
                    expr = new MethodCallNode(name.getLine(), name.getColumn(), expr, name.getLexeme(), args);
                } else {
                    expr = new FieldAccessNode(name.getLine(), name.getColumn(), expr, name.getLexeme());
                }
            } else if (match(TokenType.LBRACKET)) {
                ExpressionNode index = parseExpression();
                Token rbracket = consume(TokenType.RBRACKET, "Expected ']' after array index");
                expr = new ArrayAccessNode(rbracket.getLine(), rbracket.getColumn(), expr, index);
            } else if (match(TokenType.PLUS_PLUS, TokenType.MINUS_MINUS)) {
                Token op = previous();
                expr = new UnaryExpressionNode(op.getLine(), op.getColumn(), op.getLexeme(), expr, false);
            } else {
                break;
            }
        }

        return expr;
    }

    private ExpressionNode parsePrimary() {
        Token token = peek();
        int line = token.getLine();
        int col = token.getColumn();

        if (match(TokenType.TRUE)) {
            return new LiteralNode(line, col, true, "boolean");
        }
        if (match(TokenType.FALSE)) {
            return new LiteralNode(line, col, false, "boolean");
        }
        if (match(TokenType.NULL)) {
            return new LiteralNode(line, col, null, "null");
        }
        if (match(TokenType.INTEGER_LITERAL)) {
            return new LiteralNode(line, col, previous().getLiteral(), "int");
        }
        if (match(TokenType.DOUBLE_LITERAL)) {
            return new LiteralNode(line, col, previous().getLiteral(), "double");
        }
        if (match(TokenType.STRING_LITERAL)) {
            return new LiteralNode(line, col, previous().getLiteral(), "String");
        }
        if (match(TokenType.THIS)) {
            return new ThisExpressionNode(line, col);
        }

        if (match(TokenType.NEW)) {
            return parseNewExpression(line, col);
        }

        if (match(TokenType.LBRACE)) {
            // Array literal {1, 2, 3}
            List<ExpressionNode> elements = new ArrayList<>();
            if (!check(TokenType.RBRACE)) {
                do {
                    elements.add(parseExpression());
                } while (match(TokenType.COMMA));
            }
            consume(TokenType.RBRACE, "Expected '}' after array initializers");
            return new ArrayCreationNode(line, col, "Object", null, elements);
        }

        if (match(TokenType.IDENTIFIER)) {
            String name = previous().getLexeme();
            // Check for direct method call: name(args)
            if (match(TokenType.LPAREN)) {
                List<ExpressionNode> args = parseArgumentsAfterOpenParen();
                return new MethodCallNode(line, col, null, name, args);
            }
            return new VariableExpressionNode(line, col, name);
        }

        if (match(TokenType.LPAREN)) {
            ExpressionNode expr = parseExpression();
            consume(TokenType.RPAREN, "Expected ')' after expression");
            return expr;
        }

        throw error(peek(), "Unexpected token: '" + peek().getLexeme() + "'");
    }

    private ExpressionNode parseNewExpression(int line, int col) {
        String typeName = parseTypeName();

        if (match(TokenType.LBRACKET)) {
            // new int[5]
            ExpressionNode size = parseExpression();
            consume(TokenType.RBRACKET, "Expected ']' after array size");
            return new ArrayCreationNode(line, col, typeName, size, null);
        }

        consume(TokenType.LPAREN, "Expected '(' after class name in 'new' expression");
        List<ExpressionNode> args = parseArgumentsAfterOpenParen();
        return new ObjectCreationNode(line, col, typeName, args);
    }

    private List<ExpressionNode> parseArgumentsAfterOpenParen() {
        List<ExpressionNode> args = new ArrayList<>();
        if (!check(TokenType.RPAREN)) {
            do {
                args.add(parseExpression());
            } while (match(TokenType.COMMA));
        }
        consume(TokenType.RPAREN, "Expected ')' after arguments");
        return args;
    }

    private Token consume(TokenType type, String message) {
        if (check(type)) return advance();
        throw error(peek(), message);
    }

    private ParseException error(Token token, String message) {
        return new ParseException(message, token.getLine(), token.getColumn());
    }

    private boolean match(TokenType... types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private boolean check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().getType() == type;
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean isAtEnd() {
        return peek().getType() == TokenType.EOF;
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Token peekNext() {
        if (current + 1 >= tokens.size()) return tokens.get(tokens.size() - 1);
        return tokens.get(current + 1);
    }

    private Token previous() {
        return tokens.get(current - 1);
    }
}
