package com.warriors.centre.repository;

import com.warriors.centre.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(String status);
    List<Event> findByEventType(String eventType);
    List<Event> findByEventDateBetween(LocalDate start, LocalDate end);

    // ✅ Avec JOIN FETCH sur tags
    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.tags WHERE e.eventDate >= :date ORDER BY e.eventDate ASC")
    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(@Param("date") LocalDate date);

    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.tags WHERE " +
           "LOWER(e.title)       LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.location)    LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Event> searchEvents(@Param("search") String search);

    // ✅ findAll avec JOIN FETCH
    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.tags")
    List<Event> findAllWithTags();

    // ✅ findById avec JOIN FETCH
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.tags WHERE e.id = :id")
    Optional<Event> findByIdWithTags(@Param("id") Long id);

    // ✅ Top 3 prochains événements avec tags
    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.tags WHERE e.eventDate > :date ORDER BY e.eventDate ASC")
    List<Event> findTop3WithTagsAfter(@Param("date") LocalDate date);

    long countByStatus(String status);

    @Query("SELECT DISTINCT e.eventType FROM Event e ORDER BY e.eventType")
    List<String> findAllEventTypes();

    // Garde pour compatibilité DashboardService
    List<Event> findTop3ByEventDateAfterOrderByEventDateAsc(LocalDate date);

    // Remplacer findTop3WithTagsAfter par cette version qui inclut aujourd'hui
@Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.tags WHERE e.eventDate >= :date ORDER BY e.eventDate ASC")
List<Event> findTop3WithTagsAfterOrEqual(@Param("date") LocalDate date);

// Garder aussi pour compatibilité
List<Event> findTop3ByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate date);
}