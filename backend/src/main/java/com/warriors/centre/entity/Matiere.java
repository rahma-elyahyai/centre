package com.warriors.centre.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matieres")
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;            // ex: "Physique-Chimie"

    @Column(length = 10)
    private String icon;           // ex: "⚗️"

    @Column(length = 20)
    private String color;          // ← AJOUTÉ : couleur accent ex: "#3b82f6"

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer ordre = 0;

    @Column(nullable = false)
    private Boolean actif = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "niveau_id", nullable = false)
    private Niveau niveau;

    @OneToMany(mappedBy = "matiere",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    @OrderBy("ordre ASC")
    private List<Module> modules = new ArrayList<>();

    /* ── Constructeurs ── */
    public Matiere() {}

    /* ── Getters / Setters ── */
    public Long    getId()                         { return id; }
    public void    setId(Long id)                  { this.id = id; }
    public String  getNom()                        { return nom; }
    public void    setNom(String nom)              { this.nom = nom; }
    public String  getIcon()                       { return icon; }
    public void    setIcon(String icon)            { this.icon = icon; }
    public String  getColor()                      { return color; }
    public void    setColor(String color)          { this.color = color; }
    public String  getDescription()                { return description; }
    public void    setDescription(String d)        { this.description = d; }
    public Integer getOrdre()                      { return ordre; }
    public void    setOrdre(Integer ordre)         { this.ordre = ordre; }
    public Boolean getActif()                      { return actif; }
    public void    setActif(Boolean actif)         { this.actif = actif; }
    public Niveau  getNiveau()                     { return niveau; }
    public void    setNiveau(Niveau niveau)        { this.niveau = niveau; }
    public List<Module> getModules()               { return modules; }
    public void    setModules(List<Module> m)      { this.modules = m; }
}