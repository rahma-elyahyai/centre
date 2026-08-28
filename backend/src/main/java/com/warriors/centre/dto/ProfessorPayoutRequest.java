package com.warriors.centre.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ProfessorPayoutRequest {

    @NotNull(message = "Le professeur est requis")
    private Long professorId;

    @NotNull(message = "Le mois est requis")
    private String mois;

    @NotNull(message = "Le montant est requis")
    private Double montant;

    private String statut;

    private LocalDate paymentDate;

    private String notes;

    public ProfessorPayoutRequest() {}

    public Long getProfessorId() { return professorId; }
    public void setProfessorId(Long professorId) { this.professorId = professorId; }

    public String getMois() { return mois; }
    public void setMois(String mois) { this.mois = mois; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
