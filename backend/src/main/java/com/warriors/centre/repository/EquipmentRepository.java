package com.warriors.centre.repository;

import com.warriors.centre.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    @Query("SELECT COALESCE(SUM(e.montant * e.quantite), 0) FROM Equipment e")
    Double getTotalMontant();
}
