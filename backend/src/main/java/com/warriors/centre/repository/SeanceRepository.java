package com.warriors.centre.repository;


import com.warriors.centre.entity.Seance;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

// ════════════════════════════════════════════════════════
//  SeanceRepository
// ════════════════════════════════════════════════════════
public interface SeanceRepository extends JpaRepository<Seance, Long> {

    List<Seance> findByModuleIdOrderByOrdreAsc(Long moduleId);

    List<Seance> findByModuleIdAndDisponibleTrueOrderByOrdreAsc(Long moduleId);

    long countByModuleId(Long moduleId);
}