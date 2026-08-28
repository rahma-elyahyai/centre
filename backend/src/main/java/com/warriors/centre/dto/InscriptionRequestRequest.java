package com.warriors.centre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class InscriptionRequestRequest {

    @NotBlank(message = "Le prénom est requis")
    private String prenom;

    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "Le téléphone est requis")
    private String telephone;

    @NotBlank(message = "Le téléphone du parent est requis")
    private String telephoneParent;

    @NotBlank(message = "Le lien de parenté est requis")
    private String lienParente;

    @NotBlank(message = "Le niveau est requis")
    private String niveau;

    private String filiere;

    private List<String> matieresSouhaitees;

    @NotNull(message = "La modalité est requise")
    private String modalite;

    private String statut;

    private String notes;

    public InscriptionRequestRequest() {}

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
}
