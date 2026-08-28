package com.warriors.centre.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "professor_rates")
public class ProfessorRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @Column(nullable = false)
    private String matiere;

    @Column(nullable = false)
    private String niveau;

    @Column(name = "montant_par_etudiant", nullable = false)
    private Double montantParEtudiant;

    public ProfessorRate() {}

    public ProfessorRate(Professor professor, String matiere, String niveau, Double montantParEtudiant) {
        this.professor = professor;
        this.matiere = matiere;
        this.niveau = niveau;
        this.montantParEtudiant = montantParEtudiant;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }

    public String getMatiere() { return matiere; }
    public void setMatiere(String matiere) { this.matiere = matiere; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public Double getMontantParEtudiant() { return montantParEtudiant; }
    public void setMontantParEtudiant(Double montantParEtudiant) { this.montantParEtudiant = montantParEtudiant; }
}
