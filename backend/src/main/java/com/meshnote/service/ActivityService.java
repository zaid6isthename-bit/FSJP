package com.meshnote.service;

import com.meshnote.dto.ActivityDto;
import com.meshnote.model.ActivityEvent;
import com.meshnote.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<ActivityDto> getRecentActivities(int limit) {
        return activityRepository.findAll(limit).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ActivityDto toDto(ActivityEvent e) {
        return new ActivityDto(
                e.getId(),
                e.getEventType(),
                e.getTitle(),
                e.getDescription(),
                e.getPeerId(),
                e.getCreatedAt()
        );
    }
}
