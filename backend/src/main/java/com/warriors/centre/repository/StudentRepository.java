// src/main/java/com/warriors/centre/repository/StudentRepository.java
package com.warriors.centre.repository;

import com.warriors.centre.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Recherche simple par niveau et filière
    Page<Student> findByNiveauAndFiliere(String niveau, String filiere, Pageable pageable);
    
    Page<Student> findByNiveau(String niveau, Pageable pageable);
    
    Page<Student> findByFiliere(String filiere, Pageable pageable);
    
    // Recherche textuelle avancée
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(CONCAT(s.prenom, ' ', s.nom)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(s.email, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "s.phoneNumber LIKE CONCAT('%', :search, '%') OR " +
           "s.parentPhone LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(s.etablissement) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Student> searchStudents(@Param("search") String search, Pageable pageable);
    
    // Filtre combiné avec tous les critères
    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.matieres WHERE " +
           "(:niveau IS NULL OR s.niveau = :niveau) AND " +
           "(:filiere IS NULL OR s.filiere = :filiere) AND " +
           "(:search IS NULL OR " +
           "LOWER(CONCAT(s.prenom, ' ', s.nom)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(s.email, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "s.phoneNumber LIKE CONCAT('%', :search, '%') OR " +
           "s.parentPhone LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(s.etablissement) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> filterStudents(
            @Param("niveau") String niveau,
            @Param("filiere") String filiere,
            @Param("search") String search,
            Pageable pageable);
    
    // Récupération par groupe (pour les statistiques)
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.matieres WHERE s.niveau = :niveau AND s.filiere = :filiere")
    List<Student> findByNiveauAndFiliereWithSubjects(
            @Param("niveau") String niveau,
            @Param("filiere") String filiere);
    
    // Vérifications d'unicité
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByPhoneNumber(String phoneNumber);
    
    // Récupération de tous les niveaux distincts
    @Query("SELECT DISTINCT s.niveau FROM Student s ORDER BY s.niveau")
    List<String> findDistinctNiveaux();
    
    // Récupération de toutes les filières distinctes
    @Query("SELECT DISTINCT s.filiere FROM Student s ORDER BY s.filiere")
    List<String> findDistinctFilieres();
    
    // Compter les étudiants par niveau
    long countByNiveau(String niveau);
    
    // Compter les étudiants par filière
    long countByFiliere(String filiere);
    
    // Compter les étudiants par niveau et filière
    long countByNiveauAndFiliere(String niveau, String filiere);
 long countByCreatedAtAfter(LocalDateTime date);
 long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
 List<Student> findTop5ByOrderByCreatedAtDesc();
 // Dans StudentRepository.java — ajoute cette méthode

}