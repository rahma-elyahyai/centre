package com.warriors.centre.dto;

import java.time.LocalDateTime;
import java.util.List;

public class InscriptionRequestResponse {

    private Long id;
    private String prenom;
    private String nom;
    private String fullName;
    private String telephone;
    private String telephoneParent;
    private String lienParente;
    private String niveau;
    private String filiere;
    private List<String> matieresSouhaitees;
    private String modalite;
    private String statut;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InscriptionRequestResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

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
