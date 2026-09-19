package com.jvmvision.controller;

import com.jvmvision.dto.ApiResponse;
import com.jvmvision.dto.RunCodeRequest;
import com.jvmvision.dto.ValidateCodeRequest;
import com.jvmvision.engine.trace.ExecutionTrace;
import com.jvmvision.service.ExecutionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/execution")
public class ExecutionController {
    private final ExecutionService executionService;

    public ExecutionController(ExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validate(@Valid @RequestBody ValidateCodeRequest request) {
        Map<String, Object> validation = executionService.validateCode(request.getCode());
        boolean isValid = Boolean.TRUE.equals(validation.get("valid"));
        if (isValid) {
            return ResponseEntity.ok(ApiResponse.ok(validation, "Syntax is valid"));
        } else {
            return ResponseEntity.ok(ApiResponse.error(String.valueOf(validation.get("message")), "SYNTAX_ERROR"));
        }
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<ExecutionTrace>> run(@Valid @RequestBody RunCodeRequest request) {
        ExecutionTrace trace = executionService.runCode(request.getCode(), request.getTitle());
        String msg = "COMPLETED".equals(trace.getStatus()) ?
                "Execution completed successfully" :
                "Execution terminated with " + trace.getErrorType();
        return ResponseEntity.ok(ApiResponse.ok(trace, msg));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<ExecutionTrace>> getSessionTrace(@PathVariable String sessionId) {
        Optional<ExecutionTrace> trace = executionService.getSessionTrace(sessionId);
        return trace.map(t -> ResponseEntity.ok(ApiResponse.ok(t, "Session retrieved")))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Session not found", "SESSION_NOT_FOUND")));
    }
}
