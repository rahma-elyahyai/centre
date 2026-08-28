package com.warriors.centre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProfessorPayoutResponse {

    private Long id;
    private Long professorId;
    private String professorName;
    private String mois;
    private Double montant;
    private String statut;
    private LocalDate paymentDate;
    private String notes;
    private boolean virtual; // true = pas encore de ligne en base, montant suggéré par le calcul
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProfessorPayoutResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProfessorId() { return professorId; }
    public void setProfessorId(Long professorId) { this.professorId = professorId; }

    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }

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

    public boolean isVirtual() { return virtual; }
    public void setVirtual(boolean virtual) { this.virtual = virtual; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
