package com.jvmvision.controller;

import com.jvmvision.dto.ApiResponse;
import com.jvmvision.model.Example;
import com.jvmvision.service.ExampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/examples")
public class ExampleController {
    private final ExampleService exampleService;

    public ExampleController(ExampleService exampleService) {
        this.exampleService = exampleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Example>>> getAllExamples() {
        List<Example> list = exampleService.getAllExamples();
        return ResponseEntity.ok(ApiResponse.ok(list, "Examples retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Example>> getExampleById(@PathVariable String id) {
        Optional<Example> ex = exampleService.getExampleById(id);
        return ex.map(example -> ResponseEntity.ok(ApiResponse.ok(example, "Example retrieved")))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Example not found: " + id, "NOT_FOUND")));
    }
}
