package com.warriors.centre.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 10)
    private String icon;

    private Integer ordre;

    private Boolean actif = true;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("ordre ASC")
    private List<Seance> seances;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Constructors ──────────────────────────────────────
    public Module() {}

    public Module(Long id, Matiere matiere, String nom, String icon,
                  Integer ordre, Boolean actif, List<Seance> seances) {
        this.id      = id;
        this.matiere = matiere;
        this.nom     = nom;
        this.icon    = icon;
        this.ordre   = ordre;
        this.actif   = actif;
        this.seances = seances;
    }

    // ── Getters & Setters ─────────────────────────────────
    public Long getId()                      { return id; }
    public void setId(Long id)               { this.id = id; }

    public Matiere getMatiere()              { return matiere; }
    public void setMatiere(Matiere matiere)  { this.matiere = matiere; }

    public String getNom()                   { return nom; }
    public void setNom(String nom)           { this.nom = nom; }

    public String getIcon()                  { return icon; }
    public void setIcon(String icon)         { this.icon = icon; }

    public Integer getOrdre()                { return ordre; }
    public void setOrdre(Integer ordre)      { this.ordre = ordre; }

    public Boolean getActif()                { return actif; }
    public void setActif(Boolean actif)      { this.actif = actif; }

    public List<Seance> getSeances()                 { return seances; }
    public void setSeances(List<Seance> seances)     { this.seances = seances; }

    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }
}
