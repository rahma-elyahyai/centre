package com.warriors.centre.dto;

import java.time.LocalDateTime;

public class ProfileResponse {

    private Long id;
    private String prenom;
    private String nom;
    private String fullName;
    private String email;
    private String role;
    private String phoneNumber;
    private String bio;
    private String avatarEmoji;
    private Boolean isEnabled;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    // Stats
    private Long totalStudents;
    private Long totalProfessors;
    private Long totalCourses;
    private Long totalEvents;

    public ProfileResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarEmoji() { return avatarEmoji; }
    public void setAvatarEmoji(String avatarEmoji) { this.avatarEmoji = avatarEmoji; }

    public Boolean getIsEnabled() { return isEnabled; }
    public void setIsEnabled(Boolean isEnabled) { this.isEnabled = isEnabled; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalProfessors() { return totalProfessors; }
    public void setTotalProfessors(Long totalProfessors) { this.totalProfessors = totalProfessors; }

    public Long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(Long totalCourses) { this.totalCourses = totalCourses; }

    public Long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Long totalEvents) { this.totalEvents = totalEvents; }
}