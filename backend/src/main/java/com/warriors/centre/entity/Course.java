package com.warriors.centre.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est requis")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "La matière est requise")
    @Column(nullable = false)
    private String subject;

    @NotBlank(message = "Le niveau est requis")
    @Column(nullable = false)
    private String level;

    @NotNull(message = "Le professeur est requis")
    @Column(name = "professor_id", nullable = false)
    private Long professorId;

    @Column(name = "professor_name")
    private String professorName;

    @NotBlank(message = "Le type de cours est requis")
    @Column(name = "course_type", nullable = false)
    private String courseType;

    @NotBlank(message = "L'horaire est requis")
    @Column(nullable = false)
    private String schedule;

    @NotBlank(message = "L'heure est requise")
    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String duration;

    @NotBlank(message = "La salle est requise")
    @Column(nullable = false)
    private String room;

    @NotNull(message = "La capacité est requise")
    @Min(value = 1, message = "La capacité doit être supérieure à 0")
    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer enrolled = 0;

    @NotNull(message = "Le prix est requis")
    @Min(value = 0, message = "Le prix doit être positif")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "La date de début est requise")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "La date de fin est requise")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ✅ FIX — EAGER pour eviter LazyInitializationException
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "course_objectives", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "objective")
    private List<String> objectives = new ArrayList<>();

    @NotBlank(message = "Le statut est requis")
    @Column(nullable = false)
    private String status = "\u00c0 venir"; // "À venir"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Course() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public Long getProfessorId() { return professorId; }
    public void setProfessorId(Long professorId) { this.professorId = professorId; }
    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }
    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }
    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getEnrolled() { return enrolled; }
    public void setEnrolled(Integer enrolled) { this.enrolled = enrolled; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getObjectives() { return objectives; }
    public void setObjectives(List<String> objectives) { this.objectives = objectives; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}