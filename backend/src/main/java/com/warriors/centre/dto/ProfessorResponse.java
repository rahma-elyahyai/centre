// src/main/java/com/warriors/centre/dto/ProfessorResponse.java
package com.warriors.centre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProfessorResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String specialite;
    private String experienceLevel;
    private List<String> matieres;
    private String diplome;
    private String bio;
    private String disponibilite;
    private Double salaire;
    private LocalDate dateRecrutement;
    private String avatarType;
    private String avatarEmoji;
    private String photoUrl;
    private String displayAvatar; // Avatar affiché (emoji ou URL photo)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProfessorResponse() {}
    
    public ProfessorResponse(Long id, String nom, String prenom, String email, String phoneNumber,
                           String specialite, String experienceLevel, List<String> matieres,
                           String diplome, String bio, String disponibilite, Double salaire,
                           LocalDate dateRecrutement, String avatar) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.fullName = prenom + " " + nom;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.specialite = specialite;
        this.experienceLevel = experienceLevel;
        this.matieres = matieres;
        this.diplome = diplome;
        this.bio = bio;
        this.disponibilite = disponibilite;
        this.salaire = salaire;
        this.dateRecrutement = dateRecrutement;
        this.avatarType = avatarType;
        this.avatarEmoji = avatarEmoji;
        this.photoUrl = photoUrl;
        this.displayAvatar = avatarType != null && avatarType.equals("photo") ? photoUrl : avatarEmoji;
                            
    }
    
    // Getters
    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getSpecialite() { return specialite; }
    public String getExperienceLevel() { return experienceLevel; }
    public List<String> getMatieres() { return matieres; }
    public String getDiplome() { return diplome; }
    public String getBio() { return bio; }
    public String getDisponibilite() { return disponibilite; }
    public Double getSalaire() { return salaire; }
    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public String getAvatarType() { return avatarType; }
    public String getAvatarEmoji() { return avatarEmoji; }  
    public String getPhotoUrl() { return photoUrl; }
    public String getDisplayAvatar() { return displayAvatar; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setNom(String nom) { this.nom = nom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public void setMatieres(List<String> matieres) { this.matieres = matieres; }
    public void setDiplome(String diplome) { this.diplome = diplome; }
    public void setBio(String bio) { this.bio = bio; }
    public void setDisponibilite(String disponibilite) { this.disponibilite = disponibilite; }
    public void setSalaire(Double salaire) { this.salaire = salaire; }
    public void setDateRecrutement(LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }
    public void setAvatarType(String avatarType) { this.avatarType = avatarType; }
    public void setAvatarEmoji(String avatarEmoji) { this.avatarEmoji = avatarEmoji; }      
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }  
    public void setDisplayAvatar(String displayAvatar) { this.displayAvatar = displayAvatar; }  
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}