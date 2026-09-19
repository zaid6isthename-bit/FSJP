package com.jvmvision.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RunCodeRequest {
    @NotBlank(message = "Source code is required")
    @Size(max = 51200, message = "Source code exceeds 50 KB limit")
    private String code;

    private String title;

    public RunCodeRequest() {}

    public RunCodeRequest(String code, String title) {
        this.code = code;
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
