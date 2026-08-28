package com.warriors.centre.repository;

import com.warriors.centre.entity.ProfessorPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorPayoutRepository extends JpaRepository<ProfessorPayout, Long> {

    List<ProfessorPayout> findByMois(String mois);

    Optional<ProfessorPayout> findByProfessorIdAndMois(Long professorId, String mois);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM ProfessorPayout p WHERE p.statut = :statut")
    Double getTotalByStatut(@Param("statut") String statut);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM ProfessorPayout p WHERE p.statut = :statut AND p.mois = :mois")
    Double getTotalByStatutAndMois(@Param("statut") String statut, @Param("mois") String mois);

    long countByStatut(String statut);
}
