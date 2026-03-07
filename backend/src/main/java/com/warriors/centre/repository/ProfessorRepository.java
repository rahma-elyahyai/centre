package com.warriors.centre.repository;

import com.warriors.centre.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    List<Professor> findBySpecialite(String specialite);

    // ✅ FIX — JOIN FETCH sur matieres pour eviter le lazy loading
    @Query("SELECT DISTINCT p FROM Professor p LEFT JOIN FETCH p.matieres WHERE " +
           "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.specialite) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Professor> searchProfessors(@Param("search") String search);

    // ✅ findAll avec fetch join — remplace le findAll() natif dans le service
    @Query("SELECT DISTINCT p FROM Professor p LEFT JOIN FETCH p.matieres")
    List<Professor> findAllWithMatieres();

    // ✅ findById avec fetch join
    @Query("SELECT p FROM Professor p LEFT JOIN FETCH p.matieres WHERE p.id = :id")
    Optional<Professor> findByIdWithMatieres(@Param("id") Long id);

    boolean existsByEmail(String email);
}