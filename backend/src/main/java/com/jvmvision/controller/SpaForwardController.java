package com.jvmvision.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/visualizer",
            "/visualizer/{sessionId}",
            "/examples",
            "/history",
            "/about",
            "/syllabus",
            "/syllabus/**",
            "/demo"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
