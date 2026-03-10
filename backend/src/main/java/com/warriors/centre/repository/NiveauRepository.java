package com.warriors.centre.repository;

import com.warriors.centre.entity.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {

    List<Niveau> findByActifTrueOrderByOrdreAsc();

    Optional<Niveau> findByCodeAndActifTrue(String code);

    @Query("""
        SELECT DISTINCT n FROM Niveau n
        LEFT JOIN FETCH n.matieres m
        WHERE n.actif = true
        ORDER BY n.ordre ASC
        """)
    List<Niveau> findAllWithMatieres();

    @Query("""
        SELECT DISTINCT n FROM Niveau n
        LEFT JOIN FETCH n.matieres m
        WHERE n.id = :id AND n.actif = true
        """)
    Optional<Niveau> findByIdWithMatieres(@Param("id") Long id);

    @Query("""
        SELECT DISTINCT n FROM Niveau n
        LEFT JOIN FETCH n.matieres m
        WHERE n.code = :code AND n.actif = true
        """)
    Optional<Niveau> findByCodeWithMatieres(@Param("code") String code);
}