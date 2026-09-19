package com.jvmvision.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ValidateCodeRequest {
    @NotBlank(message = "Source code is required")
    @Size(max = 51200, message = "Source code exceeds 50 KB limit")
    private String code;

    public ValidateCodeRequest() {}

    public ValidateCodeRequest(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
