package com.warriors.centre.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "niveaux")
public class Niveau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 80)
    private String label;

    @Column(name = "full_label", nullable = false, length = 120)
    private String fullLabel;

    @Column(length = 10)
    private String emoji;

    @Column(name = "color_hex", length = 10)
    private String colorHex;

    private Integer ordre;

    private Boolean actif = true;

    @OneToMany(mappedBy = "niveau", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("ordre ASC")
    private List<Matiere> matieres;

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
    public Niveau() {}

    public Niveau(Long id, String code, String label, String fullLabel,
                  String emoji, String colorHex, Integer ordre, Boolean actif,
                  List<Matiere> matieres) {
        this.id        = id;
        this.code      = code;
        this.label     = label;
        this.fullLabel = fullLabel;
        this.emoji     = emoji;
        this.colorHex  = colorHex;
        this.ordre     = ordre;
        this.actif     = actif;
        this.matieres  = matieres;
    }

    // ── Getters & Setters ─────────────────────────────────
    public Long getId()                      { return id; }
    public void setId(Long id)               { this.id = id; }

    public String getCode()                  { return code; }
    public void setCode(String code)         { this.code = code; }

    public String getLabel()                 { return label; }
    public void setLabel(String label)       { this.label = label; }

    public String getFullLabel()             { return fullLabel; }
    public void setFullLabel(String v)       { this.fullLabel = v; }

    public String getEmoji()                 { return emoji; }
    public void setEmoji(String emoji)       { this.emoji = emoji; }

    public String getColorHex()              { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public Integer getOrdre()                { return ordre; }
    public void setOrdre(Integer ordre)      { this.ordre = ordre; }

    public Boolean getActif()                { return actif; }
    public void setActif(Boolean actif)      { this.actif = actif; }

    public List<Matiere> getMatieres()               { return matieres; }
    public void setMatieres(List<Matiere> matieres)  { this.matieres = matieres; }

    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }
}