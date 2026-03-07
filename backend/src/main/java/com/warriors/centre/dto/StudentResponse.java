// src/main/java/com/warriors/centre/dto/StudentResponse.java
package com.warriors.centre.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class StudentResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String parentPhone;
    private String niveau;
    private String filiere;
    private String etablissement;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateInscription;
    
    private List<String> matieres = new ArrayList<>();
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructeurs
    public StudentResponse() {
        this.matieres = new ArrayList<>();
    }
    
    public StudentResponse(Long id, String nom, String prenom, String fullName, String email, 
                          String phoneNumber, String parentPhone, String niveau, String filiere, 
                          String etablissement, LocalDate dateInscription, List<String> matieres, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.parentPhone = parentPhone;
        this.niveau = niveau;
        this.filiere = filiere;
        this.etablissement = etablissement;
        this.dateInscription = dateInscription;
        this.matieres = matieres != null ? matieres : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Builder pattern
    public static StudentResponseBuilder builder() {
        return new StudentResponseBuilder();
    }
    
    public static class StudentResponseBuilder {
        private Long id;
        private String nom;
        private String prenom;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String parentPhone;
        private String niveau;
        private String filiere;
        private String etablissement;
        private LocalDate dateInscription;
        private List<String> matieres = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public StudentResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public StudentResponseBuilder nom(String nom) {
            this.nom = nom;
            return this;
        }
        
        public StudentResponseBuilder prenom(String prenom) {
            this.prenom = prenom;
            return this;
        }
        
        public StudentResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }
        
        public StudentResponseBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public StudentResponseBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
        
        public StudentResponseBuilder parentPhone(String parentPhone) {
            this.parentPhone = parentPhone;
            return this;
        }
        
        public StudentResponseBuilder niveau(String niveau) {
            this.niveau = niveau;
            return this;
        }
        
        public StudentResponseBuilder filiere(String filiere) {
            this.filiere = filiere;
            return this;
        }
        
        public StudentResponseBuilder etablissement(String etablissement) {
            this.etablissement = etablissement;
            return this;
        }
        
        public StudentResponseBuilder dateInscription(LocalDate dateInscription) {
            this.dateInscription = dateInscription;
            return this;
        }
        
        public StudentResponseBuilder matieres(List<String> matieres) {
            this.matieres = matieres;
            return this;
        }
        
        public StudentResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public StudentResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public StudentResponse build() {
            return new StudentResponse(id, nom, prenom, fullName, email, phoneNumber, 
                                      parentPhone, niveau, filiere, etablissement, 
                                      dateInscription, matieres, createdAt, updatedAt);
        }
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getPrenom() {
        return prenom;
    }
    
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getParentPhone() {
        return parentPhone;
    }
    
    public void setParentPhone(String parentPhone) {
        this.parentPhone = parentPhone;
    }
    
    public String getNiveau() {
        return niveau;
    }
    
    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }
    
    public String getFiliere() {
        return filiere;
    }
    
    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }
    
    public String getEtablissement() {
        return etablissement;
    }
    
    public void setEtablissement(String etablissement) {
        this.etablissement = etablissement;
    }
    
    public LocalDate getDateInscription() {
        return dateInscription;
    }
    
    public void setDateInscription(LocalDate dateInscription) {
        this.dateInscription = dateInscription;
    }
    
    public List<String> getMatieres() {
        return matieres;
    }
    
    public void setMatieres(List<String> matieres) {
        this.matieres = matieres;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}