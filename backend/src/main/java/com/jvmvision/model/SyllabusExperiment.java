package com.jvmvision.model;

import java.time.LocalDateTime;
import java.util.List;

public class SyllabusExperiment {
    private String id;
    private int experimentNumber;
    private String title;
    private String category;
    private String technology;
    private String description;
    private String code;
    private String language;
    private List<String> concepts;
    private String difficulty;
    private String aim;
    private String expectedOutput;
    private String routePath;
    private boolean isJvmVisualizable;
    private LocalDateTime createdAt;

    public SyllabusExperiment() {}

    public SyllabusExperiment(String id, int experimentNumber, String title, String category,
                              String technology, String description, String code, String language,
                              List<String> concepts, String difficulty, String aim,
                              String expectedOutput, String routePath, boolean isJvmVisualizable,
                              LocalDateTime createdAt) {
        this.id = id;
        this.experimentNumber = experimentNumber;
        this.title = title;
        this.category = category;
        this.technology = technology;
        this.description = description;
        this.code = code;
        this.language = language;
        this.concepts = concepts;
        this.difficulty = difficulty;
        this.aim = aim;
        this.expectedOutput = expectedOutput;
        this.routePath = routePath;
        this.isJvmVisualizable = isJvmVisualizable;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getExperimentNumber() {
        return experimentNumber;
    }

    public void setExperimentNumber(int experimentNumber) {
        this.experimentNumber = experimentNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<String> getConcepts() {
        return concepts;
    }

    public void setConcepts(List<String> concepts) {
        this.concepts = concepts;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getAim() {
        return aim;
    }

    public void setAim(String aim) {
        this.aim = aim;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }

    public String getRoutePath() {
        return routePath;
    }

    public void setRoutePath(String routePath) {
        this.routePath = routePath;
    }

    public boolean isJvmVisualizable() {
        return isJvmVisualizable;
    }

    public void setJvmVisualizable(boolean jvmVisualizable) {
        isJvmVisualizable = jvmVisualizable;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
