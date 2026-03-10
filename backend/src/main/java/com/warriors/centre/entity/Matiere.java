package com.warriors.centre.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "matieres")
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "niveau_id", nullable = false)
    private Niveau niveau;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 10)
    private String icon;

    @Column(length = 255)
    private String description;

    private Integer ordre;

    private Boolean actif = true;

    @OneToMany(mappedBy = "matiere", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("ordre ASC")
    private List<Module> modules;

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
    public Matiere() {}

    public Matiere(Long id, Niveau niveau, String nom, String icon,
                   String description, Integer ordre, Boolean actif,
                   List<Module> modules) {
        this.id          = id;
        this.niveau      = niveau;
        this.nom         = nom;
        this.icon        = icon;
        this.description = description;
        this.ordre       = ordre;
        this.actif       = actif;
        this.modules     = modules;
    }

    // ── Getters & Setters ─────────────────────────────────
    public Long getId()                      { return id; }
    public void setId(Long id)               { this.id = id; }

    public Niveau getNiveau()                { return niveau; }
    public void setNiveau(Niveau niveau)     { this.niveau = niveau; }

    public String getNom()                   { return nom; }
    public void setNom(String nom)           { this.nom = nom; }

    public String getIcon()                  { return icon; }
    public void setIcon(String icon)         { this.icon = icon; }

    public String getDescription()           { return description; }
    public void setDescription(String desc)  { this.description = desc; }

    public Integer getOrdre()                { return ordre; }
    public void setOrdre(Integer ordre)      { this.ordre = ordre; }

    public Boolean getActif()                { return actif; }
    public void setActif(Boolean actif)      { this.actif = actif; }

    public List<Module> getModules()                 { return modules; }
    public void setModules(List<Module> modules)     { this.modules = modules; }

    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }
}