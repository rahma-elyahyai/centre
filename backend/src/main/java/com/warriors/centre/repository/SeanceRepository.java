package com.warriors.centre.repository;

import com.warriors.centre.entity.Matiere;
import com.warriors.centre.entity.Module;
import com.warriors.centre.entity.Niveau;
import com.warriors.centre.entity.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
// ════════════════════════════════════════════════════════
//  SeanceRepository
// ════════════════════════════════════════════════════════
public interface SeanceRepository extends JpaRepository<Seance, Long> {

    List<Seance> findByModuleIdOrderByOrdreAsc(Long moduleId);

    List<Seance> findByModuleIdAndDisponibleTrueOrderByOrdreAsc(Long moduleId);

    long countByModuleId(Long moduleId);
}