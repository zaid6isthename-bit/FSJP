package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.NotificationDto;
import com.meshnote.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationDto>> getNotifications() {
        return ApiResponse.ok(notificationService.getAllNotifications());
    }

    @PostMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.ok(null, "Notification marked as read");
    }

    @PostMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.ok(null, "All notifications marked as read");
    }
}
