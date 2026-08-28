package com.warriors.centre.dto;

public class ProfessorRateDto {

    // ─── Utilisé dans ProfessorRequest (entrée) ───
    public static class TarifRequest {
        private String matiere;
        private String niveau;
        private Double montantParEtudiant;

        public TarifRequest() {}

        public String getMatiere() { return matiere; }
        public void setMatiere(String matiere) { this.matiere = matiere; }

        public String getNiveau() { return niveau; }
        public void setNiveau(String niveau) { this.niveau = niveau; }

        public Double getMontantParEtudiant() { return montantParEtudiant; }
        public void setMontantParEtudiant(Double montantParEtudiant) { this.montantParEtudiant = montantParEtudiant; }
    }

    // ─── Utilisé dans ProfessorResponse (sortie) ───
    public static class TarifResponse {
        private Long id;
        private String matiere;
        private String niveau;
        private Double montantParEtudiant;
        private long nombreEtudiants;      // nb d'étudiants concernés actuellement
        private Double revenuCalcule;      // nombreEtudiants * montantParEtudiant

        public TarifResponse() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getMatiere() { return matiere; }
        public void setMatiere(String matiere) { this.matiere = matiere; }

        public String getNiveau() { return niveau; }
        public void setNiveau(String niveau) { this.niveau = niveau; }

        public Double getMontantParEtudiant() { return montantParEtudiant; }
        public void setMontantParEtudiant(Double montantParEtudiant) { this.montantParEtudiant = montantParEtudiant; }

        public long getNombreEtudiants() { return nombreEtudiants; }
        public void setNombreEtudiants(long nombreEtudiants) { this.nombreEtudiants = nombreEtudiants; }

        public Double getRevenuCalcule() { return revenuCalcule; }
        public void setRevenuCalcule(Double revenuCalcule) { this.revenuCalcule = revenuCalcule; }
    }
}
