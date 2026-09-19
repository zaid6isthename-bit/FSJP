package com.meshnote.repository;

import com.meshnote.model.ActivityEvent;
import java.util.List;

public interface ActivityRepository {
    List<ActivityEvent> findAll(int limit);
    ActivityEvent save(ActivityEvent event);
}
