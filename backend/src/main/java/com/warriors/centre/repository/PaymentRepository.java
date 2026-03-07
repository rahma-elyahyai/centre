package com.warriors.centre.repository;

import com.warriors.centre.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Fetch join - evite N+1 queries sur student
    @Query("SELECT p FROM Payment p JOIN FETCH p.student s")
    List<Payment> findAllWithStudent();

    @Query("SELECT p FROM Payment p JOIN FETCH p.student s WHERE p.id = :id")
    Optional<Payment> findByIdWithStudent(@Param("id") Long id);

    // !! CORRECTION ENCODAGE : utiliser :status en parametre (jamais hardcoder "Payé" dans le JPQL)
    @Query("SELECT COALESCE(SUM(CASE WHEN p.customPrice IS NOT NULL THEN p.customPrice ELSE p.amount END), 0) " +
           "FROM Payment p WHERE p.status = :status")
    Double getTotalByStatus(@Param("status") String status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") String status);

    @Query("SELECT COALESCE(SUM(CASE WHEN p.customPrice IS NOT NULL THEN p.customPrice ELSE p.amount END), 0) " +
           "FROM Payment p WHERE p.status = :status AND p.paymentMonth = :month")
    Double getTotalByStatusAndMonth(@Param("status") String status, @Param("month") String month);
}