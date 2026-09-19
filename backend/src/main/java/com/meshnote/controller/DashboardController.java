package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.DashboardStatsDto;
import com.meshnote.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ApiResponse<DashboardStatsDto> getDashboardStats() {
        return ApiResponse.ok(dashboardService.getDashboardStats());
    }
}
