package com.warriors.centre.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(length = 10)
    private String icon;           // ex: "🌊"

    @Column(nullable = false)
    private Integer ordre = 0;

    @Column(nullable = false)
    private Boolean actif = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;

    @OneToMany(mappedBy = "module",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    @OrderBy("ordre ASC")
    private List<Seance> seances = new ArrayList<>();

    /* ── Constructeurs ── */
    public Module() {}

    /* ── Getters / Setters ── */
    public Long    getId()                        { return id; }
    public void    setId(Long id)                 { this.id = id; }
    public String  getNom()                       { return nom; }
    public void    setNom(String nom)             { this.nom = nom; }
    public String  getIcon()                      { return icon; }
    public void    setIcon(String icon)           { this.icon = icon; }
    public Integer getOrdre()                     { return ordre; }
    public void    setOrdre(Integer ordre)        { this.ordre = ordre; }
    public Boolean getActif()                     { return actif; }
    public void    setActif(Boolean actif)        { this.actif = actif; }
    public Matiere getMatiere()                   { return matiere; }
    public void    setMatiere(Matiere matiere)    { this.matiere = matiere; }
    public List<Seance> getSeances()              { return seances; }
    public void    setSeances(List<Seance> s)     { this.seances = s; }
}