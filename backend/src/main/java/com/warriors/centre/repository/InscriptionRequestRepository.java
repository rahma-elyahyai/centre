package com.warriors.centre.repository;

import com.warriors.centre.entity.InscriptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscriptionRequestRepository extends JpaRepository<InscriptionRequest, Long> {

    long countByStatut(String statut);

    long countByModalite(String modalite);

    // NOTE : les 3 paramètres ne doivent JAMAIS être null (utiliser "" comme valeur "pas de filtre").
    // PostgreSQL/Hibernate échoue à déterminer le type d'un paramètre null utilisé dans une
    // concaténation avec LOWER(...) — il tente "lower(bytea)" au lieu de "lower(text)" et plante.
    @Query("SELECT DISTINCT r FROM InscriptionRequest r LEFT JOIN FETCH r.matieresSouhaitees WHERE " +
           "(:statut = '' OR r.statut = :statut) AND " +
           "(:modalite = '' OR r.modalite = :modalite) AND " +
           "(:search = '' OR " +
           "LOWER(CONCAT(r.prenom, ' ', r.nom)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "r.telephone LIKE CONCAT('%', :search, '%') OR " +
           "r.telephoneParent LIKE CONCAT('%', :search, '%')) " +
           "ORDER BY r.createdAt DESC")
    List<InscriptionRequest> filter(
            @Param("statut") String statut,
            @Param("modalite") String modalite,
            @Param("search") String search);
}
