package com.warriors.centre.repository;

import com.warriors.centre.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findBySubject(String subject);
    List<Course> findByLevel(String level);
    List<Course> findByProfessorId(Long professorId);
    List<Course> findByStatus(String status);

    // ✅ findAll avec JOIN FETCH — charge objectives en une seule requête SQL
    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.objectives")
    List<Course> findAllWithObjectives();

    // ✅ findById avec JOIN FETCH
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.objectives WHERE c.id = :id")
    Optional<Course> findByIdWithObjectives(@Param("id") Long id);

    // ✅ searchCourses avec JOIN FETCH
    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.objectives WHERE " +
           "LOWER(c.title)   LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.room)    LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Course> searchCourses(@Param("search") String search);

    @Query("SELECT DISTINCT c.subject FROM Course c ORDER BY c.subject")
    List<String> findAllSubjects();

    @Query("SELECT DISTINCT c.level FROM Course c ORDER BY c.level")
    List<String> findAllLevels();

    long countByStatus(String status);
    long countByCreatedAtAfter(LocalDateTime date);
}