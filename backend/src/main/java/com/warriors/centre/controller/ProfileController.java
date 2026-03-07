package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.PasswordChangeRequest;
import com.warriors.centre.dto.ProfileResponse;
import com.warriors.centre.dto.ProfileUpdateRequest;
import com.warriors.centre.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        try {
            ProfileResponse profile = profileService.getCurrentProfile();
            return ResponseEntity.ok(new ApiResponse<>(true, "Profil récupéré", profile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request) {
        try {
            ProfileResponse profile = profileService.updateProfile(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Profil mis à jour avec succès", profile));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody PasswordChangeRequest request) {
        try {
            profileService.changePassword(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Mot de passe modifié avec succès", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
