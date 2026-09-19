package com.meshnote.repository;

import com.meshnote.model.Notification;
import java.util.List;

public interface NotificationRepository {
    List<Notification> findAll();
    List<Notification> findUnread();
    Notification save(Notification notification);
    void markAsRead(Long id);
    void markAllAsRead();
}
