package com.warriors.centre.repository;
import com.warriors.centre.entity.Module;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
// ════════════════════════════════════════════════════════
//  ModuleRepository
// ════════════════════════════════════════════════════════
public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByMatiereIdAndActifTrueOrderByOrdreAsc(Long matiereId);

    @Query("""
        SELECT DISTINCT mo FROM Module mo
        LEFT JOIN FETCH mo.seances
        WHERE mo.matiere.id = :matiereId AND mo.actif = true
        ORDER BY mo.ordre ASC
        """)
    List<Module> findByMatiereIdWithSeances(@Param("matiereId") Long matiereId);
}

