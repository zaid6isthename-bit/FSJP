package com.jvmvision.repository;

import com.jvmvision.model.Example;

import java.util.List;
import java.util.Optional;

public interface ExampleRepository {
    List<Example> findAll();
    Optional<Example> findById(String id);
    Example save(Example example);
    long count();
}
