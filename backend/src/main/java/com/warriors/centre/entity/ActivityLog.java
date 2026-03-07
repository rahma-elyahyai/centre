// src/main/java/com/warriors/centre/entity/ActivityLog.java
package com.warriors.centre.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // INSCRIPTION | PAYMENT | COURSE | MESSAGE | CERTIFICATE | EVENT
    @Column(nullable = false, length = 30)
    private String type;

    // "Nouvelle inscription", "Paiement reçu"…
    @Column(nullable = false)
    private String label;

    // Nom de la personne concernée
    @Column(name = "user_name")
    private String userName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public ActivityLog() {}

    public ActivityLog(String type, String label, String userName) {
        this.type     = type;
        this.label    = label;
        this.userName = userName;
    }

    public Long          getId()        { return id; }
    public String        getType()      { return type; }
    public void          setType(String v)       { this.type = v; }
    public String        getLabel()     { return label; }
    public void          setLabel(String v)      { this.label = v; }
    public String        getUserName()  { return userName; }
    public void          setUserName(String v)   { this.userName = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void          setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}


// ─────────────────────────────────────────────────────────
// src/main/java/com/warriors/centre/repository/ActivityLogRepository.java
// ─────────────────────────────────────────────────────────
// package com.warriors.centre.repository;
//
// import com.warriors.centre.entity.ActivityLog;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import java.util.List;
//
// @Repository
// public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
//     List<ActivityLog> findTop10ByOrderByCreatedAtDesc();
// }