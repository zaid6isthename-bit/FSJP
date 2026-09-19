package com.jvmvision.service;

import com.jvmvision.engine.ast.ProgramNode;
import com.jvmvision.engine.interpreter.Interpreter;
import com.jvmvision.engine.lexer.Lexer;
import com.jvmvision.engine.lexer.Token;
import com.jvmvision.engine.parser.ParseException;
import com.jvmvision.engine.parser.Parser;
import com.jvmvision.engine.trace.ExecutionTrace;
import com.jvmvision.model.ExecutionSession;
import com.jvmvision.repository.ExecutionEventRepository;
import com.jvmvision.repository.ExecutionSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExecutionService {
    private final ExecutionSessionRepository sessionRepository;
    private final ExecutionEventRepository eventRepository;

    @Value("${jvmvision.engine.max-source-size:51200}")
    private int maxSourceSize;

    @Value("${jvmvision.engine.max-events:10000}")
    private int maxEvents;

    @Value("${jvmvision.engine.max-loop-iterations:5000}")
    private int maxLoopIterations;

    @Value("${jvmvision.engine.max-recursion-depth:100}")
    private int maxRecursionDepth;

    @Value("${jvmvision.engine.max-output-size:102400}")
    private int maxOutputSize;

    public ExecutionService(ExecutionSessionRepository sessionRepository, ExecutionEventRepository eventRepository) {
        this.sessionRepository = sessionRepository;
        this.eventRepository = eventRepository;
    }

    public Map<String, Object> validateCode(String code) {
        Map<String, Object> result = new LinkedHashMap<>();
        if (code == null || code.trim().isEmpty()) {
            result.put("valid", false);
            result.put("message", "Source code cannot be empty");
            result.put("line", 1);
            return result;
        }

        if (code.length() > maxSourceSize) {
            result.put("valid", false);
            result.put("message", "Source code exceeds maximum allowed size of " + (maxSourceSize / 1024) + " KB");
            result.put("line", 1);
            return result;
        }

        try {
            Lexer lexer = new Lexer(code);
            List<Token> tokens = lexer.scanTokens();
            Parser parser = new Parser(tokens);
            parser.parse();

            result.put("valid", true);
            result.put("message", "Java syntax validated successfully");
            return result;
        } catch (ParseException ex) {
            result.put("valid", false);
            result.put("message", ex.getMessage());
            result.put("line", ex.getLine());
            result.put("column", ex.getColumn());
            return result;
        } catch (Exception ex) {
            result.put("valid", false);
            result.put("message", ex.getMessage());
            result.put("line", 1);
            return result;
        }
    }

    public ExecutionTrace runCode(String code, String title) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Source code cannot be empty");
        }

        if (code.length() > maxSourceSize) {
            throw new IllegalArgumentException("Source code exceeds maximum size limit of " + (maxSourceSize / 1024) + " KB");
        }

        String sessionId = UUID.randomUUID().toString();
        String sessionTitle = (title != null && !title.trim().isEmpty()) ? title.trim() : "Untitled Program";

        // Lexing & Parsing
        Lexer lexer = new Lexer(code);
        List<Token> tokens = lexer.scanTokens();
        Parser parser = new Parser(tokens);
        ProgramNode programNode = parser.parse();

        // Controlled AST Interpretation
        Interpreter interpreter = new Interpreter(programNode, maxEvents, maxLoopIterations, maxRecursionDepth, maxOutputSize);
        ExecutionTrace trace = interpreter.execute(sessionId);

        // Persist session and events
        ExecutionSession session = new ExecutionSession(
                sessionId,
                sessionTitle,
                code,
                trace.getStatus(),
                trace.getErrorType(),
                trace.getErrorMessage(),
                trace.getTotalEvents()
        );

        sessionRepository.save(session);
        eventRepository.saveEvents(sessionId, trace.getEvents());

        return trace;
    }

    public Optional<ExecutionTrace> getSessionTrace(String sessionId) {
        Optional<ExecutionSession> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isEmpty()) {
            return Optional.empty();
        }

        ExecutionSession session = sessionOpt.get();
        var events = eventRepository.findEventsBySessionId(sessionId);

        ExecutionTrace trace = new ExecutionTrace(
                session.getSessionId(),
                session.getStatus(),
                events,
                session.getErrorType(),
                session.getErrorMessage(),
                null,
                null
        );

        return Optional.of(trace);
    }
}
