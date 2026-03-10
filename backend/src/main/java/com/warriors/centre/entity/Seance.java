package com.warriors.centre.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seances")
public class Seance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(name = "sous_titre", length = 200)
    private String sousTitre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 20)
    private String duree = "~45 min";

    @Column(name = "type_seance", length = 20)
    private String typeSeance = "cours";   // cours | exercices | td

    private Boolean disponible = true;

    private Integer ordre;

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
    public Seance() {}

    public Seance(Long id, Module module, String titre, String sousTitre,
                  String description, String videoUrl, String imageUrl,
                  String duree, String typeSeance, Boolean disponible, Integer ordre) {
        this.id          = id;
        this.module      = module;
        this.titre       = titre;
        this.sousTitre   = sousTitre;
        this.description = description;
        this.videoUrl    = videoUrl;
        this.imageUrl    = imageUrl;
        this.duree       = duree;
        this.typeSeance  = typeSeance;
        this.disponible  = disponible;
        this.ordre       = ordre;
    }

    // ── Getters & Setters ─────────────────────────────────
    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public Module getModule()                  { return module; }
    public void setModule(Module module)       { this.module = module; }

    public String getTitre()                   { return titre; }
    public void setTitre(String titre)         { this.titre = titre; }

    public String getSousTitre()               { return sousTitre; }
    public void setSousTitre(String sousTitre) { this.sousTitre = sousTitre; }

    public String getDescription()             { return description; }
    public void setDescription(String desc)    { this.description = desc; }

    public String getVideoUrl()                { return videoUrl; }
    public void setVideoUrl(String videoUrl)   { this.videoUrl = videoUrl; }

    public String getImageUrl()                { return imageUrl; }
    public void setImageUrl(String imageUrl)   { this.imageUrl = imageUrl; }

    public String getDuree()                   { return duree; }
    public void setDuree(String duree)         { this.duree = duree; }

    public String getTypeSeance()              { return typeSeance; }
    public void setTypeSeance(String t)        { this.typeSeance = t; }

    public Boolean getDisponible()             { return disponible; }
    public void setDisponible(Boolean d)       { this.disponible = d; }

    public Integer getOrdre()                  { return ordre; }
    public void setOrdre(Integer ordre)        { this.ordre = ordre; }

    public LocalDateTime getCreatedAt()        { return createdAt; }
    public LocalDateTime getUpdatedAt()        { return updatedAt; }
}