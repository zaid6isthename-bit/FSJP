package com.jvmvision.service;

import com.jvmvision.engine.examples.ExampleProgramCatalog;
import com.jvmvision.model.Example;
import com.jvmvision.repository.ExampleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExampleService {
    private final ExampleRepository exampleRepository;

    public ExampleService(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    @PostConstruct
    public void initExamples() {
        if (exampleRepository.count() == 0) {
            for (Example ex : ExampleProgramCatalog.getBuiltinExamples()) {
                exampleRepository.save(ex);
            }
        }
    }

    public List<Example> getAllExamples() {
        List<Example> list = exampleRepository.findAll();
        if (list.isEmpty()) {
            return ExampleProgramCatalog.getBuiltinExamples();
        }
        return list;
    }

    public Optional<Example> getExampleById(String id) {
        Optional<Example> ex = exampleRepository.findById(id);
        if (ex.isPresent()) return ex;

        for (Example catalogEx : ExampleProgramCatalog.getBuiltinExamples()) {
            if (catalogEx.getId().equals(id)) {
                return Optional.of(catalogEx);
            }
        }
        return Optional.empty();
    }
}
