package com.meshnote.controller;

import com.meshnote.dto.ActivityDto;
import com.meshnote.dto.ApiResponse;
import com.meshnote.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ApiResponse<List<ActivityDto>> getActivities(@RequestParam(value = "limit", defaultValue = "30") int limit) {
        return ApiResponse.ok(activityService.getRecentActivities(limit));
    }
}
