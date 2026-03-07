package com.warriors.centre.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class CourseRequest {
    
    @NotBlank(message = "Le titre est requis")
    private String title;
    
    @NotBlank(message = "La matière est requise")
    private String subject;
    
    @NotBlank(message = "Le niveau est requis")
    private String level;
    
    @NotNull(message = "Le professeur est requis")
    private Long professorId;
    
    @NotBlank(message = "Le type de cours est requis")
    private String courseType;
    
    @NotBlank(message = "L'horaire est requis")
    private String schedule;
    
    @NotBlank(message = "L'heure est requise")
    private String time;
    
    private String duration;
    
    @NotBlank(message = "La salle est requise")
    private String room;
    
    @NotNull(message = "La capacité est requise")
    @Min(value = 1, message = "La capacité doit être supérieure à 0")
    private Integer capacity;
    
    @NotNull(message = "Le prix est requis")
    @Min(value = 0, message = "Le prix doit être positif")
    private Double price;
    
    @NotNull(message = "La date de début est requise")
    private LocalDate startDate;
    
    @NotNull(message = "La date de fin est requise")
    private LocalDate endDate;
    
    private String description;
    
    private List<String> objectives;
    
    @NotBlank(message = "Le statut est requis")
    private String status;
    
    // Constructeurs
    public CourseRequest() {
    }
    
    // Getters et Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }
    
    public Long getProfessorId() {
        return professorId;
    }
    
    public void setProfessorId(Long professorId) {
        this.professorId = professorId;
    }
    
    public String getCourseType() {
        return courseType;
    }
    
    public void setCourseType(String courseType) {
        this.courseType = courseType;
    }
    
    public String getSchedule() {
        return schedule;
    }
    
    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
    
    public String getTime() {
        return time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }
    
    public String getDuration() {
        return duration;
    }
    
    public void setDuration(String duration) {
        this.duration = duration;
    }
    
    public String getRoom() {
        return room;
    }
    
    public void setRoom(String room) {
        this.room = room;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getObjectives() {
        return objectives;
    }
    
    public void setObjectives(List<String> objectives) {
        this.objectives = objectives;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
