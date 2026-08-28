package com.warriors.centre.service;

import com.warriors.centre.dto.StaffPaymentRequest;
import com.warriors.centre.dto.StaffPaymentResponse;
import com.warriors.centre.entity.StaffPayment;
import com.warriors.centre.repository.StaffPaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StaffPaymentService {

    private final StaffPaymentRepository repository;

    public StaffPaymentService(StaffPaymentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public StaffPaymentResponse create(StaffPaymentRequest request) {
        StaffPayment sp = new StaffPayment();
        sp.setNomEmploye(request.getNomEmploye().trim());
        sp.setPoste(request.getPoste().trim());
        sp.setMontant(request.getMontant());
        sp.setPeriodicite(request.getPeriodicite() != null ? request.getPeriodicite() : "Mensuel");
        sp.setPaymentMonth(request.getPaymentMonth());
        sp.setPaymentDate(request.getPaymentDate());
        sp.setStatut(request.getStatut() != null ? request.getStatut() : "Non payé");
        sp.setNotes(request.getNotes());

        if ("Payé".equals(sp.getStatut()) && sp.getPaymentDate() == null) {
            sp.setPaymentDate(LocalDate.now());
        }

        return mapToResponse(repository.save(sp));
    }

    @Transactional
    public StaffPaymentResponse update(Long id, StaffPaymentRequest request) {
        StaffPayment sp = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement employé non trouvé avec l'ID: " + id));

        sp.setNomEmploye(request.getNomEmploye().trim());
        sp.setPoste(request.getPoste().trim());
        sp.setMontant(request.getMontant());
        sp.setPeriodicite(request.getPeriodicite() != null ? request.getPeriodicite() : sp.getPeriodicite());
        sp.setPaymentMonth(request.getPaymentMonth());
        sp.setStatut(request.getStatut() != null ? request.getStatut() : sp.getStatut());
        sp.setNotes(request.getNotes());

        if ("Payé".equals(sp.getStatut()) && sp.getPaymentDate() == null) {
            sp.setPaymentDate(LocalDate.now());
        } else if (request.getPaymentDate() != null) {
            sp.setPaymentDate(request.getPaymentDate());
        }

        return mapToResponse(repository.save(sp));
    }

    @Transactional
    public StaffPaymentResponse markAsPaid(Long id) {
        StaffPayment sp = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement employé non trouvé avec l'ID: " + id));
        sp.setStatut("Payé");
        sp.setPaymentDate(LocalDate.now());
        return mapToResponse(repository.save(sp));
    }

    @Transactional(readOnly = true)
    public StaffPaymentResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement employé non trouvé avec l'ID: " + id)));
    }

    @Transactional(readOnly = true)
    public List<StaffPaymentResponse> getAll(String statut, String search) {
        List<StaffPayment> all = repository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            all = all.stream()
                    .filter(s -> s.getNomEmploye().toLowerCase().contains(q) || s.getPoste().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }
        if (statut != null && !statut.isEmpty() && !statut.equals("all")) {
            all = all.stream().filter(s -> statut.equals(s.getStatut())).collect(Collectors.toList());
        }

        return all.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPaid", repository.getTotalByStatut("Payé"));
        stats.put("totalUnpaid", repository.getTotalByStatut("Non payé"));
        stats.put("countPaid", repository.countByStatut("Payé"));
        stats.put("countUnpaid", repository.countByStatut("Non payé"));
        stats.put("total", repository.count());
        String currentMonth = LocalDate.now().toString().substring(0, 7);
        stats.put("currentMonthTotal", repository.getTotalByStatutAndMonth("Payé", currentMonth));
        return stats;
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Paiement employé non trouvé avec l'ID: " + id);
        }
        repository.deleteById(id);
    }

    private StaffPaymentResponse mapToResponse(StaffPayment sp) {
        StaffPaymentResponse r = new StaffPaymentResponse();
        r.setId(sp.getId());
        r.setNomEmploye(sp.getNomEmploye());
        r.setPoste(sp.getPoste());
        r.setMontant(sp.getMontant());
        r.setPeriodicite(sp.getPeriodicite());
        r.setPaymentMonth(sp.getPaymentMonth());
        r.setPaymentDate(sp.getPaymentDate());
        r.setStatut(sp.getStatut());
        r.setNotes(sp.getNotes());
        r.setCreatedAt(sp.getCreatedAt());
        r.setUpdatedAt(sp.getUpdatedAt());
        return r;
    }
}
