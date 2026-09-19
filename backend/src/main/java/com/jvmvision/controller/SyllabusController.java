package com.jvmvision.controller;

import com.jvmvision.dto.ApiResponse;
import com.jvmvision.model.SyllabusExperiment;
import com.jvmvision.service.SyllabusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/syllabus")
@CrossOrigin(origins = "*")
public class SyllabusController {

    private final SyllabusService syllabusService;

    public SyllabusController(SyllabusService syllabusService) {
        this.syllabusService = syllabusService;
    }

    @GetMapping("/experiments")
    public ResponseEntity<ApiResponse<List<SyllabusExperiment>>> getAllExperiments() {
        List<SyllabusExperiment> list = syllabusService.getAllExperiments();
        return ResponseEntity.ok(ApiResponse.success(list, "Retrieved " + list.size() + " syllabus experiments."));
    }

    @GetMapping("/experiments/{id}")
    public ResponseEntity<ApiResponse<SyllabusExperiment>> getExperimentById(@PathVariable String id) {
        Optional<SyllabusExperiment> opt = syllabusService.getExperimentById(id);
        if (opt.isEmpty()) {
            try {
                int num = Integer.parseInt(id);
                opt = syllabusService.getExperimentByNumber(num);
            } catch (NumberFormatException ignored) {}
        }

        if (opt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(opt.get(), "Experiment retrieved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Syllabus experiment not found: " + id, "NOT_FOUND"));
        }
    }

    @GetMapping("/experiments/category/{category}")
    public ResponseEntity<ApiResponse<List<SyllabusExperiment>>> getByCategory(@PathVariable String category) {
        List<SyllabusExperiment> list = syllabusService.getExperimentsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(list, "Found " + list.size() + " experiments in category " + category));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<SyllabusExperiment>>> searchExperiments(@RequestParam(required = false) String q) {
        List<SyllabusExperiment> list = syllabusService.searchExperiments(q);
        return ResponseEntity.ok(ApiResponse.success(list, "Search returned " + list.size() + " matching experiments."));
    }
}
