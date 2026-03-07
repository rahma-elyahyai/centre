package com.warriors.centre.dto;

public class StudentFilterRequest {
    private String niveau;
    private String filiere;
    private String search;
    private Integer page = 0;
    private Integer size = 20;
    
    // Getters and Setters
    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }
    
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
    
    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
    
    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }
    
    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }
}