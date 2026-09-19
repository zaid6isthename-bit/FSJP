package com.meshnote.repository;

import com.meshnote.model.UserProfile;
import java.util.Optional;

public interface UserRepository {
    Optional<UserProfile> findProfile();
    UserProfile save(UserProfile profile);
    UserProfile update(UserProfile profile);
}
