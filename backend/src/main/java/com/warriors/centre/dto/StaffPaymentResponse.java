package com.warriors.centre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StaffPaymentResponse {

    private Long id;
    private String nomEmploye;
    private String poste;
    private Double montant;
    private String periodicite;
    private String paymentMonth;
    private LocalDate paymentDate;
    private String statut;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StaffPaymentResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
