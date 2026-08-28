package com.warriors.centre.service;

import com.warriors.centre.dto.EquipmentRequest;
import com.warriors.centre.dto.EquipmentResponse;
import com.warriors.centre.entity.Equipment;
import com.warriors.centre.repository.EquipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    private final EquipmentRepository repository;

    public EquipmentService(EquipmentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public EquipmentResponse create(EquipmentRequest request) {
        Equipment e = new Equipment();
        e.setLibelle(request.getLibelle().trim());
        e.setCategorie(request.getCategorie().trim());
        e.setMontant(request.getMontant());
        e.setQuantite(request.getQuantite() != null ? request.getQuantite() : 1);
        e.setFournisseur(request.getFournisseur());
        e.setDateAchat(request.getDateAchat() != null ? request.getDateAchat() : LocalDate.now());
        e.setNotes(request.getNotes());
        return mapToResponse(repository.save(e));
    }

    @Transactional
    public EquipmentResponse update(Long id, EquipmentRequest request) {
        Equipment e = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Équipement non trouvé avec l'ID: " + id));

        e.setLibelle(request.getLibelle().trim());
        e.setCategorie(request.getCategorie().trim());
        e.setMontant(request.getMontant());
        e.setQuantite(request.getQuantite() != null ? request.getQuantite() : e.getQuantite());
        e.setFournisseur(request.getFournisseur());
        if (request.getDateAchat() != null) e.setDateAchat(request.getDateAchat());
        e.setNotes(request.getNotes());

        return mapToResponse(repository.save(e));
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Équipement non trouvé avec l'ID: " + id)));
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAll(String categorie, String search) {
        List<Equipment> all = repository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            all = all.stream()
                    .filter(e -> e.getLibelle().toLowerCase().contains(q)
                            || (e.getFournisseur() != null && e.getFournisseur().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }
        if (categorie != null && !categorie.isEmpty() && !categorie.equals("all")) {
            all = all.stream().filter(e -> categorie.equals(e.getCategorie())).collect(Collectors.toList());
        }

        return all.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return repository.findAll().stream()
                .map(Equipment::getCategorie)
                .distinct().sorted().collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMontant", repository.getTotalMontant());
        stats.put("total", repository.count());
        stats.put("categories", getAllCategories());
        return stats;
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Équipement non trouvé avec l'ID: " + id);
        }
        repository.deleteById(id);
    }

    private EquipmentResponse mapToResponse(Equipment e) {
        EquipmentResponse r = new EquipmentResponse();
        r.setId(e.getId());
        r.setLibelle(e.getLibelle());
        r.setCategorie(e.getCategorie());
        r.setMontant(e.getMontant());
        r.setQuantite(e.getQuantite());
        r.setFournisseur(e.getFournisseur());
        r.setDateAchat(e.getDateAchat());
        r.setNotes(e.getNotes());
        r.setCreatedAt(e.getCreatedAt());
        r.setUpdatedAt(e.getUpdatedAt());
        return r;
    }
}
