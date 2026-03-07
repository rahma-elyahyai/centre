package com.warriors.centre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CourseResponse {
    
    private Long id;
    private String title;
    private String subject;
    private String level;
    private Long professorId;
    private String professorName;
    private String courseType;
    private String schedule;
    private String time;
    private String duration;
    private String room;
    private Integer capacity;
    private Integer enrolled;
    private Double price;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private List<String> objectives;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructeurs
    public CourseResponse() {
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getProfessorName() {
        return professorName;
    }
    
    public void setProfessorName(String professorName) {
        this.professorName = professorName;
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
    
    public Integer getEnrolled() {
        return enrolled;
    }
    
    public void setEnrolled(Integer enrolled) {
        this.enrolled = enrolled;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
