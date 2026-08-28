package com.warriors.centre.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inscription_requests")
public class InscriptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le prénom est requis")
    @Column(nullable = false)
    private String prenom;

    @NotBlank(message = "Le nom est requis")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Le téléphone est requis")
    @Column(nullable = false)
    private String telephone;

    @NotBlank(message = "Le téléphone du parent est requis")
    @Column(name = "telephone_parent", nullable = false)
    private String telephoneParent;

    @NotBlank(message = "Le lien de parenté est requis")
    @Column(name = "lien_parente", nullable = false)
    private String lienParente; // "Père" | "Mère" | "Frère" | "Oncle" | texte libre si "Autre"

    @NotBlank(message = "Le niveau est requis")
    @Column(nullable = false)
    private String niveau;

    @Column
    private String filiere;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "inscription_request_matieres", joinColumns = @JoinColumn(name = "inscription_request_id"))
    @Column(name = "matiere")
    private List<String> matieresSouhaitees = new ArrayList<>();

    @NotNull(message = "La modalité est requise")
    @Column(nullable = false)
    private String modalite; // "Présentiel" | "À distance"

    @Column(nullable = false)
    private String statut = "Nouveau"; // "Nouveau" | "Contacté" | "Inscrit" | "Refusé"

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public InscriptionRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getTelephoneParent() { return telephoneParent; }
    public void setTelephoneParent(String telephoneParent) { this.telephoneParent = telephoneParent; }

    public String getLienParente() { return lienParente; }
    public void setLienParente(String lienParente) { this.lienParente = lienParente; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }

    public List<String> getMatieresSouhaitees() { return matieresSouhaitees; }
    public void setMatieresSouhaitees(List<String> matieresSouhaitees) { this.matieresSouhaitees = matieresSouhaitees; }

    public String getModalite() { return modalite; }
    public void setModalite(String modalite) { this.modalite = modalite; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
