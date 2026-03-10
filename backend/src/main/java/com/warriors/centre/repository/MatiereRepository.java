package com.warriors.centre.repository;

import com.warriors.centre.entity.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatiereRepository extends JpaRepository<Matiere, Long> {

    List<Matiere> findByNiveauIdAndActifTrueOrderByOrdreAsc(Long niveauId);

    @Query("""
        SELECT DISTINCT m FROM Matiere m
        LEFT JOIN FETCH m.modules mo
        WHERE m.niveau.id = :niveauId AND m.actif = true
        ORDER BY m.ordre ASC
        """)
    List<Matiere> findByNiveauIdWithModules(@Param("niveauId") Long niveauId);
}