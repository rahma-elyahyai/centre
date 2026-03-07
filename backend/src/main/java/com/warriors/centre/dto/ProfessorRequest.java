// src/main/java/com/warriors/centre/dto/ProfessorRequest.java
package com.warriors.centre.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;

public class ProfessorRequest {
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est requis")
    private String email;
    
    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    @NotBlank(message = "Le téléphone est requis")
    private String phoneNumber;
    
    @NotBlank(message = "La spécialité est requise")
    private String specialite;
    
    @NotBlank(message = "Le niveau d'expérience est requis")
    private String experienceLevel;
    
    private List<String> matieres;
    
    @NotBlank(message = "Le diplôme est requis")
    private String diplome;
    
    private String bio;
    
    private String disponibilite;
    
    @NotBlank(message = "Le salaire est requis")
    private String salaire;
    
    private LocalDate dateRecrutement;
    
    @Pattern(regexp = "^(emoji|photo)$", message = "Le type d'avatar doit être 'emoji' ou 'photo'")
    private String avatarType = "emoji";
    
    private String avatarEmoji;
    
    private String photoUrl; // Pour les photos déjà uploadées
    
    // Getters and Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
    
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    
    public List<String> getMatieres() { return matieres; }
    public void setMatieres(List<String> matieres) { this.matieres = matieres; }
    
    public String getDiplome() { return diplome; }
    public void setDiplome(String diplome) { this.diplome = diplome; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getDisponibilite() { return disponibilite; }
    public void setDisponibilite(String disponibilite) { this.disponibilite = disponibilite; }
    
    public String getSalaire() { return salaire; }
    public void setSalaire(String salaire) { this.salaire = salaire; }
    
    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public void setDateRecrutement(LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }
    
     public String getAvatarType() { return avatarType; }
    public void setAvatarType(String avatarType) { this.avatarType = avatarType; }
    
    public String getAvatarEmoji() { return avatarEmoji; }
    public void setAvatarEmoji(String avatarEmoji) { this.avatarEmoji = avatarEmoji; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}