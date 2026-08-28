package com.warriors.centre.repository;

import com.warriors.centre.entity.StaffPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffPaymentRepository extends JpaRepository<StaffPayment, Long> {

    @Query("SELECT COALESCE(SUM(s.montant), 0) FROM StaffPayment s WHERE s.statut = :statut")
    Double getTotalByStatut(@Param("statut") String statut);

    @Query("SELECT COALESCE(SUM(s.montant), 0) FROM StaffPayment s WHERE s.statut = :statut AND s.paymentMonth = :month")
    Double getTotalByStatutAndMonth(@Param("statut") String statut, @Param("month") String month);

    long countByStatut(String statut);
}
