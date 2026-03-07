package com.warriors.centre.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "professors")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est requis")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Le prénom est requis")
    @Column(nullable = false)
    private String prenom;

    @Email(message = "Email invalide")
    @Column(unique = true, nullable = false)
    private String email;

    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotBlank(message = "La spécialité est requise")
    @Column(nullable = false)
    private String specialite;

    @NotBlank(message = "Le niveau d'expérience est requis")
    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;

    // ✅ FIX — EAGER pour eviter LazyInitializationException lors de la serialisation JSON
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "professor_subjects", joinColumns = @JoinColumn(name = "professor_id"))
    @Column(name = "subject")
    private List<String> matieres;

    @NotBlank(message = "Le diplôme est requis")
    @Column(nullable = false)
    private String diplome;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false)
    private String disponibilite = "Disponible";

    @Column(nullable = false)
    private Double salaire;

    @Column(name = "date_recrutement")
    private LocalDate dateRecrutement;

    @Column(name = "avatar_type", nullable = false)
    private String avatarType = "emoji";

    @Column(name = "avatar_emoji")
    private String avatarEmoji = "\uD83D\uDC68\u200D\uD83C\uDFEB"; // 👨‍🏫

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateRecrutement == null) {
            dateRecrutement = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getFullName() {
        return prenom + " " + nom;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Double getSalaire() { return salaire; }
    public void setSalaire(Double salaire) { this.salaire = salaire; }
    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public void setDateRecrutement(LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }
    public String getAvatarType() { return avatarType; }
    public void setAvatarType(String avatarType) { this.avatarType = avatarType; }
    public String getAvatarEmoji() { return avatarEmoji; }
    public void setAvatarEmoji(String avatarEmoji) { this.avatarEmoji = avatarEmoji; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getDisplayAvatar() {
        if ("photo".equals(avatarType) && photoUrl != null && !photoUrl.isEmpty()) {
            return photoUrl;
        }
        return avatarEmoji != null ? avatarEmoji : "\uD83D\uDC68\u200D\uD83C\uDFEB";
    }

    // Builder pattern
    public static class Builder {
        private String nom, prenom, email, phoneNumber, specialite, experienceLevel;
        private List<String> matieres;
        private String diplome, bio, disponibilite, avatarType, avatarEmoji, photoUrl;
        private Double salaire;
        private LocalDate dateRecrutement;

        public Builder nom(String v)             { this.nom = v; return this; }
        public Builder prenom(String v)          { this.prenom = v; return this; }
        public Builder email(String v)           { this.email = v; return this; }
        public Builder phoneNumber(String v)     { this.phoneNumber = v; return this; }
        public Builder specialite(String v)      { this.specialite = v; return this; }
        public Builder experienceLevel(String v) { this.experienceLevel = v; return this; }
        public Builder matieres(List<String> v)  { this.matieres = v; return this; }
        public Builder diplome(String v)         { this.diplome = v; return this; }
        public Builder bio(String v)             { this.bio = v; return this; }
        public Builder disponibilite(String v)   { this.disponibilite = v; return this; }
        public Builder salaire(Double v)         { this.salaire = v; return this; }
        public Builder dateRecrutement(LocalDate v) { this.dateRecrutement = v; return this; }
        public Builder avatarType(String v)      { this.avatarType = v; return this; }
        public Builder avatarEmoji(String v)     { this.avatarEmoji = v; return this; }
        public Builder photoUrl(String v)        { this.photoUrl = v; return this; }

        public Professor build() {
            Professor p = new Professor();
            p.setNom(nom); p.setPrenom(prenom); p.setEmail(email);
            p.setPhoneNumber(phoneNumber); p.setSpecialite(specialite);
            p.setExperienceLevel(experienceLevel); p.setMatieres(matieres);
            p.setDiplome(diplome); p.setBio(bio);
            p.setDisponibilite(disponibilite != null ? disponibilite : "Disponible");
            p.setSalaire(salaire);
            p.setDateRecrutement(dateRecrutement != null ? dateRecrutement : LocalDate.now());
            p.setAvatarType(avatarType != null ? avatarType : "emoji");
            p.setAvatarEmoji(avatarEmoji);
            p.setPhotoUrl(photoUrl);
            return p;
        }
    }

    public static Builder builder() { return new Builder(); }
}