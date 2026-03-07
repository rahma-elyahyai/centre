package com.warriors.centre.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est requis")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Le type est requis")
    @Column(name = "event_type", nullable = false)
    private String eventType;

    @NotNull(message = "La date est requise")
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @NotBlank(message = "Le lieu est requis")
    @Column(nullable = false)
    private String location;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "registered_count")
    private Integer registeredCount = 0;

    @NotBlank(message = "Le statut est requis")
    @Column(nullable = false)
    private String status = "Planifi\u00e9"; // "Planifié"

    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "entry_fee")
    private Double entryFee = 0.0;

    @Column(name = "organizer_name")
    private String organizerName;

    @Column(name = "cover_emoji")
    private String coverEmoji = "\uD83D\uDCC5"; // 📅

    // ✅ FIX — EAGER pour eviter LazyInitializationException
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = true)
    private String lieu;

    @Column(nullable = true)
    private Integer nbParticipants;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Event() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    public Double getEntryFee() { return entryFee; }
    public void setEntryFee(Double entryFee) { this.entryFee = entryFee; }
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    public String getCoverEmoji() { return coverEmoji; }
    public void setCoverEmoji(String coverEmoji) { this.coverEmoji = coverEmoji; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }
    public Integer getNbParticipants() { return nbParticipants; }
    public void setNbParticipants(Integer nbParticipants) { this.nbParticipants = nbParticipants; }
}