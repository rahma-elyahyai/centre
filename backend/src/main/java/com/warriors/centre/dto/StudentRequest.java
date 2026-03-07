// src/main/java/com/warriors/centre/dto/StudentRequest.java
package com.warriors.centre.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class StudentRequest {
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @Email(message = "Email invalide")
    private String email;
    
    @NotBlank(message = "Le numéro de téléphone est requis")
    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone invalide (format: 06XXXXXXXX)")
    private String phoneNumber;
    
    @NotBlank(message = "Le numéro de téléphone du parent est requis")
    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone du parent invalide (format: 06XXXXXXXX)")
    private String parentPhone;
    
    @NotBlank(message = "Le niveau est requis")
    private String niveau;
    
    @NotBlank(message = "La filière est requise")
    private String filiere;
    
    @NotBlank(message = "L'établissement est requis")
    private String etablissement;
    
    private LocalDate dateInscription;
    
    private List<String> matieres = new ArrayList<>();
    
    // Constructeurs
    public StudentRequest() {
        this.matieres = new ArrayList<>();
    }
    
    public StudentRequest(String nom, String prenom, String email, String phoneNumber, 
                         String parentPhone, String niveau, String filiere, String etablissement, 
                         LocalDate dateInscription, List<String> matieres) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.parentPhone = parentPhone;
        this.niveau = niveau;
        this.filiere = filiere;
        this.etablissement = etablissement;
        this.dateInscription = dateInscription;
        this.matieres = matieres != null ? matieres : new ArrayList<>();
    }
    
    // Builder pattern
    public static StudentRequestBuilder builder() {
        return new StudentRequestBuilder();
    }
    
    public static class StudentRequestBuilder {
        private String nom;
        private String prenom;
        private String email;
        private String phoneNumber;
        private String parentPhone;
        private String niveau;
        private String filiere;
        private String etablissement;
        private LocalDate dateInscription;
        private List<String> matieres = new ArrayList<>();
        
        public StudentRequestBuilder nom(String nom) {
            this.nom = nom;
            return this;
        }
        
        public StudentRequestBuilder prenom(String prenom) {
            this.prenom = prenom;
            return this;
        }
        
        public StudentRequestBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public StudentRequestBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
        
        public StudentRequestBuilder parentPhone(String parentPhone) {
            this.parentPhone = parentPhone;
            return this;
        }
        
        public StudentRequestBuilder niveau(String niveau) {
            this.niveau = niveau;
            return this;
        }
        
        public StudentRequestBuilder filiere(String filiere) {
            this.filiere = filiere;
            return this;
        }
        
        public StudentRequestBuilder etablissement(String etablissement) {
            this.etablissement = etablissement;
            return this;
        }
        
        public StudentRequestBuilder dateInscription(LocalDate dateInscription) {
            this.dateInscription = dateInscription;
            return this;
        }
        
        public StudentRequestBuilder matieres(List<String> matieres) {
            this.matieres = matieres;
            return this;
        }
        
        public StudentRequest build() {
            return new StudentRequest(nom, prenom, email, phoneNumber, parentPhone, 
                                     niveau, filiere, etablissement, dateInscription, matieres);
        }
    }
    
    // Getters et Setters
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
}