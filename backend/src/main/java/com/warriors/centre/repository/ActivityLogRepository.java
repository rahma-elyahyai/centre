// src/main/java/com/warriors/centre/repository/ActivityLogRepository.java
package com.warriors.centre.repository;

import com.warriors.centre.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop10ByOrderByCreatedAtDesc();
}


// ─────────────────────────────────────────────────────────
// Méthodes supplémentaires à ajouter dans les repositories existants
// ─────────────────────────────────────────────────────────

// Dans StudentRepository.java — ajouter :
// long countByCreatedAtAfter(LocalDateTime date);
// long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
// List<Student> findTop5ByOrderByCreatedAtDesc();

// Dans CourseRepository.java — ajouter :
// long countByCreatedAtAfter(LocalDateTime date);

// Dans EventRepository.java — ajouter :
// List<Event> findTop3ByEventDateAfterOrderByEventDateAsc(LocalDate date);

// Dans PaymentRepository.java — déjà présent :
// Double getTotalPaidByMonth(String month);