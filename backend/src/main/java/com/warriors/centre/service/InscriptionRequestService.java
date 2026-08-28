package com.warriors.centre.service;

import com.warriors.centre.dto.InscriptionRequestRequest;
import com.warriors.centre.dto.InscriptionRequestResponse;
import com.warriors.centre.entity.InscriptionRequest;
import com.warriors.centre.repository.InscriptionRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InscriptionRequestService {

    private final InscriptionRequestRepository repository;

    public InscriptionRequestService(InscriptionRequestRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public InscriptionRequestResponse create(InscriptionRequestRequest request) {
        InscriptionRequest entity = new InscriptionRequest();
        entity.setPrenom(request.getPrenom().trim());
        entity.setNom(request.getNom().trim());
        entity.setTelephone(request.getTelephone().trim());
        entity.setTelephoneParent(request.getTelephoneParent().trim());
        entity.setLienParente(request.getLienParente().trim());
        entity.setNiveau(request.getNiveau());
        entity.setFiliere(request.getFiliere());
        entity.setMatieresSouhaitees(request.getMatieresSouhaitees());
        entity.setModalite(request.getModalite());
        entity.setStatut("Nouveau");
        entity.setNotes(request.getNotes());
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public InscriptionRequestResponse updateStatut(Long id, String statut) {
        InscriptionRequest entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande d'inscription non trouvée avec l'ID: " + id));
        entity.setStatut(statut);
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public InscriptionRequestResponse updateNotes(Long id, String notes) {
        InscriptionRequest entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande d'inscription non trouvée avec l'ID: " + id));
        entity.setNotes(notes);
        return mapToResponse(repository.save(entity));
    }

    @Transactional(readOnly = true)
    public InscriptionRequestResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande d'inscription non trouvée avec l'ID: " + id)));
    }

    @Transactional(readOnly = true)
    public List<InscriptionRequestResponse> getAll(String statut, String modalite, String search) {
        // IMPORTANT : ne jamais passer null à la requête — Postgres/Hibernate plante
        // (lower(bytea) does not exist) quand un paramètre null est utilisé dans une
        // concaténation avec LOWER(). On utilise "" comme sentinelle "pas de filtre".
        String s = (statut == null || statut.isEmpty() || statut.equals("all")) ? "" : statut;
        String m = (modalite == null || modalite.isEmpty() || modalite.equals("all")) ? "" : modalite;
        String q = (search == null) ? "" : search;
        return repository.filter(s, m, q).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", repository.count());
        stats.put("countNouveau", repository.countByStatut("Nouveau"));
        stats.put("countContacte", repository.countByStatut("Contacté"));
        stats.put("countInscrit", repository.countByStatut("Inscrit"));
        stats.put("countRefuse", repository.countByStatut("Refusé"));
        stats.put("countPresentiel", repository.countByModalite("Présentiel"));
        stats.put("countDistance", repository.countByModalite("À distance"));
        return stats;
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Demande d'inscription non trouvée avec l'ID: " + id);
        }
        repository.deleteById(id);
    }

    private InscriptionRequestResponse mapToResponse(InscriptionRequest entity) {
        InscriptionRequestResponse r = new InscriptionRequestResponse();
        r.setId(entity.getId());
        r.setPrenom(entity.getPrenom());
        r.setNom(entity.getNom());
        r.setFullName(entity.getPrenom() + " " + entity.getNom());
        r.setTelephone(entity.getTelephone());
        r.setTelephoneParent(entity.getTelephoneParent());
        r.setLienParente(entity.getLienParente());
        r.setNiveau(entity.getNiveau());
        r.setFiliere(entity.getFiliere());
        r.setMatieresSouhaitees(entity.getMatieresSouhaitees());
        r.setModalite(entity.getModalite());
        r.setStatut(entity.getStatut());
        r.setNotes(entity.getNotes());
        r.setCreatedAt(entity.getCreatedAt());
        r.setUpdatedAt(entity.getUpdatedAt());
        return r;
    }
}
