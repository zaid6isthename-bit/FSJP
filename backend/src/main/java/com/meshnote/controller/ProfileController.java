package com.meshnote.controller;

import com.meshnote.dto.ApiResponse;
import com.meshnote.dto.ProfileDto;
import com.meshnote.dto.ProfileSetupRequest;
import com.meshnote.model.UserProfile;
import com.meshnote.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ApiResponse<ProfileDto> getProfile() {
        UserProfile profile = profileService.getOrCreateProfile();
        return ApiResponse.ok(profileService.toDto(profile));
    }

    @PutMapping
    public ApiResponse<ProfileDto> updateProfile(@Valid @RequestBody ProfileSetupRequest request) {
        UserProfile updated = profileService.updateProfile(request);
        return ApiResponse.ok(profileService.toDto(updated), "Profile updated successfully");
    }

    @PostMapping("/setup")
    public ApiResponse<ProfileDto> setupProfile(@Valid @RequestBody ProfileSetupRequest request) {
        UserProfile updated = profileService.updateProfile(request);
        return ApiResponse.ok(profileService.toDto(updated), "Welcome to MESHNOTE! Profile setup complete.");
    }
}
