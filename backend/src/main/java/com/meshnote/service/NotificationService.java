package com.meshnote.service;

import com.meshnote.dto.NotificationDto;
import com.meshnote.model.Notification;
import com.meshnote.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotifications() {
        return notificationRepository.findUnread().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long id) {
        notificationRepository.markAsRead(id);
    }

    public void markAllAsRead() {
        notificationRepository.markAllAsRead();
    }

    private NotificationDto toDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getType(),
                n.getTitle(),
                n.getDescription(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
