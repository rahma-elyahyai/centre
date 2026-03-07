// src/main/java/com/warriors/centre/entity/Student.java
package com.warriors.centre.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "students")
public class Student {
    
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
    @Column(unique = true)
    private String email;
    
    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone invalide")
    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;
    
    @Pattern(regexp = "^0[5-7][0-9]{8}$", message = "Numéro de téléphone du parent invalide")
    @Column(name = "parent_phone", nullable = false)
    private String parentPhone;
    
    @NotBlank(message = "Le niveau est requis")
    @Column(nullable = false)
    private String niveau;
    
    @NotBlank(message = "La filière est requise")
    @Column(nullable = false)
    private String filiere;
    
    @NotBlank(message = "Le lycée/collège est requis")
    @Column(nullable = false)
    private String etablissement;
    
    @Column(name = "date_inscription")
    private LocalDate dateInscription;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_subjects", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "subject")
    private List<String> matieres = new ArrayList<>();
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(nullable = true)
    private String statut;
    // Constructeurs
    public Student() {
        this.matieres = new ArrayList<>();
    }
    
    public Student(Long id, String nom, String prenom, String email, String phoneNumber, 
                   String parentPhone, String niveau, String filiere, String etablissement, 
                   LocalDate dateInscription, List<String> matieres, LocalDateTime createdAt, 
                   LocalDateTime updatedAt) {
        this.id = id;
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Builder pattern
    public static StudentBuilder builder() {
        return new StudentBuilder();
    }
    
    public static class StudentBuilder {
        private Long id;
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
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public StudentBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public StudentBuilder nom(String nom) {
            this.nom = nom;
            return this;
        }
        
        public StudentBuilder prenom(String prenom) {
            this.prenom = prenom;
            return this;
        }
        
        public StudentBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public StudentBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
        
        public StudentBuilder parentPhone(String parentPhone) {
            this.parentPhone = parentPhone;
            return this;
        }
        
        public StudentBuilder niveau(String niveau) {
            this.niveau = niveau;
            return this;
        }
        
        public StudentBuilder filiere(String filiere) {
            this.filiere = filiere;
            return this;
        }
        
        public StudentBuilder etablissement(String etablissement) {
            this.etablissement = etablissement;
            return this;
        }
        
        public StudentBuilder dateInscription(LocalDate dateInscription) {
            this.dateInscription = dateInscription;
            return this;
        }
        
        public StudentBuilder matieres(List<String> matieres) {
            this.matieres = matieres;
            return this;
        }
        
        public StudentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public StudentBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }
        
        public Student build() {
            return new Student(id, nom, prenom, email, phoneNumber, parentPhone, 
                             niveau, filiere, etablissement, dateInscription, 
                             matieres, createdAt, updatedAt);
        }
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateInscription == null) {
            dateInscription = LocalDate.now();
        }
        if (matieres == null) {
            matieres = new ArrayList<>();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public String getFullName() {
        return prenom + " " + nom;
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

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(id, student.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", niveau='" + niveau + '\'' +
                ", filiere='" + filiere + '\'' +
                '}';
    }
}