package com.meshnote.service;

import com.meshnote.dto.ProfileDto;
import com.meshnote.dto.ProfileSetupRequest;
import com.meshnote.model.UserProfile;
import com.meshnote.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    private static final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public synchronized UserProfile getOrCreateProfile() {
        Optional<UserProfile> existing = userRepository.findProfile();
        if (existing.isPresent()) {
            return existing.get();
        }

        // Initialize default profile
        UserProfile defaultProfile = new UserProfile(
                UUID.randomUUID().toString(),
                "Zaid Mohammed",
                "AI & ML",
                3,
                "Zaid-Laptop",
                true,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        userRepository.save(defaultProfile);
        log.info("Initialized local user profile: {}", defaultProfile);
        return defaultProfile;
    }

    public UserProfile updateProfile(ProfileSetupRequest request) {
        UserProfile current = getOrCreateProfile();
        current.setName(request.getName());
        current.setDivision(request.getDivision());
        current.setSemester(request.getSemester());
        current.setDeviceName(request.getDeviceName());
        current.setDiscoverable(request.isDiscoverable());
        current.setSharingEnabled(request.isSharingEnabled());
        return userRepository.update(current);
    }

    public ProfileDto toDto(UserProfile profile) {
        return new ProfileDto(
                profile.getId(),
                profile.getName(),
                profile.getDivision(),
                profile.getSemester(),
                profile.getDeviceName(),
                profile.isDiscoverable(),
                profile.isSharingEnabled(),
                profile.getCreatedAt()
        );
    }
}
