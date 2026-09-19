package com.jvmvision.repository;

import com.jvmvision.model.SyllabusExperiment;
import java.util.List;
import java.util.Optional;

public interface SyllabusRepository {
    List<SyllabusExperiment> findAll();
    Optional<SyllabusExperiment> findById(String id);
    Optional<SyllabusExperiment> findByExperimentNumber(int number);
    List<SyllabusExperiment> findByCategory(String category);
    List<SyllabusExperiment> search(String query);
    void save(SyllabusExperiment experiment);
    long count();
}
