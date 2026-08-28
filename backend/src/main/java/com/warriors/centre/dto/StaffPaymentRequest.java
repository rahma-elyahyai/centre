package com.warriors.centre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class StaffPaymentRequest {

    @NotBlank(message = "Le nom de l'employé est requis")
    private String nomEmploye;

    @NotBlank(message = "Le poste est requis")
    private String poste;

    @NotNull(message = "Le montant est requis")
    private Double montant;

    private String periodicite;

    private String paymentMonth;

    private LocalDate paymentDate;

    private String statut;

    private String notes;

    public StaffPaymentRequest() {}

    public String getNomEmploye() { return nomEmploye; }
    public void setNomEmploye(String nomEmploye) { this.nomEmploye = nomEmploye; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public String getPeriodicite() { return periodicite; }
    public void setPeriodicite(String periodicite) { this.periodicite = periodicite; }

    public String getPaymentMonth() { return paymentMonth; }
    public void setPaymentMonth(String paymentMonth) { this.paymentMonth = paymentMonth; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
