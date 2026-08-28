package com.warriors.centre.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_payments")
public class StaffPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'employé est requis")
    @Column(name = "nom_employe", nullable = false)
    private String nomEmploye;

    @NotBlank(message = "Le poste est requis")
    @Column(nullable = false)
    private String poste; // ex: "Secrétaire", "Femme de ménage", "Gardien"

    @NotNull(message = "Le montant est requis")
    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private String periodicite = "Mensuel"; // "Mensuel" | "Ponctuel"

    @Column(name = "payment_month")
    private String paymentMonth; // "2026-02" — pertinent si périodicité mensuelle

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(nullable = false)
    private String statut = "Non payé"; // "Payé" | "Non payé"

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

    public StaffPayment() {}

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
