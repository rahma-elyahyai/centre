package com.warriors.centre.service;

import com.warriors.centre.dto.ProfessorPayoutRequest;
import com.warriors.centre.dto.ProfessorPayoutResponse;
import com.warriors.centre.entity.Professor;
import com.warriors.centre.entity.ProfessorPayout;
import com.warriors.centre.entity.ProfessorRate;
import com.warriors.centre.repository.ProfessorPayoutRepository;
import com.warriors.centre.repository.ProfessorRepository;
import com.warriors.centre.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProfessorPayoutService {

    private final ProfessorPayoutRepository payoutRepository;
    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;

    public ProfessorPayoutService(ProfessorPayoutRepository payoutRepository,
                                   ProfessorRepository professorRepository,
                                   StudentRepository studentRepository) {
        this.payoutRepository = payoutRepository;
        this.professorRepository = professorRepository;
        this.studentRepository = studentRepository;
    }

    // Même logique de calcul que ProfessorService.mapToResponse() — revenu estimé à partir des tarifs
    private double computeRevenuEstime(Professor professor) {
        double total = 0.0;
        if (professor.getTarifs() != null) {
            for (ProfessorRate tarif : professor.getTarifs()) {
                long nbEtudiants = studentRepository.countByNiveauAndMatiere(tarif.getNiveau(), tarif.getMatiere());
                total += nbEtudiants * tarif.getMontantParEtudiant();
            }
        }
        return total;
    }

    @Transactional
    public ProfessorPayoutResponse create(ProfessorPayoutRequest request) {
        Professor professor = professorRepository.findByIdWithMatieres(request.getProfessorId())
                .orElseThrow(() -> new IllegalArgumentException("Professeur non trouvé avec l'ID: " + request.getProfessorId()));

        ProfessorPayout payout = new ProfessorPayout();
        payout.setProfessor(professor);
        payout.setMois(request.getMois());
        payout.setMontant(request.getMontant());
        payout.setStatut(request.getStatut() != null ? request.getStatut() : "Non payé");
        payout.setPaymentDate(request.getPaymentDate());
        payout.setNotes(request.getNotes());

        if ("Payé".equals(payout.getStatut()) && payout.getPaymentDate() == null) {
            payout.setPaymentDate(LocalDate.now());
        }

        return mapToResponse(payoutRepository.save(payout));
    }

    @Transactional
    public ProfessorPayoutResponse update(Long id, ProfessorPayoutRequest request) {
        ProfessorPayout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement professeur non trouvé avec l'ID: " + id));

        if (request.getProfessorId() != null && !request.getProfessorId().equals(payout.getProfessor().getId())) {
            Professor professor = professorRepository.findByIdWithMatieres(request.getProfessorId())
                    .orElseThrow(() -> new IllegalArgumentException("Professeur non trouvé avec l'ID: " + request.getProfessorId()));
            payout.setProfessor(professor);
        }

        payout.setMois(request.getMois());
        payout.setMontant(request.getMontant());
        payout.setStatut(request.getStatut() != null ? request.getStatut() : payout.getStatut());
        payout.setNotes(request.getNotes());

        if ("Payé".equals(payout.getStatut()) && payout.getPaymentDate() == null) {
            payout.setPaymentDate(LocalDate.now());
        } else if (request.getPaymentDate() != null) {
            payout.setPaymentDate(request.getPaymentDate());
        }

        return mapToResponse(payoutRepository.save(payout));
    }

    @Transactional
    public ProfessorPayoutResponse markAsPaid(Long id) {
        ProfessorPayout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement professeur non trouvé avec l'ID: " + id));
        payout.setStatut("Payé");
        payout.setPaymentDate(LocalDate.now());
        return mapToResponse(payoutRepository.save(payout));
    }

    // Crée (ou récupère) la ligne de paiement du mois pour un professeur, puis la marque payée.
    // Utilisé quand l'admin clique "Payer" sur une ligne encore virtuelle (jamais enregistrée en base).
    @Transactional
    public ProfessorPayoutResponse markAsPaidForCurrentMonth(Long professorId, Double montant) {
        String currentMonth = LocalDate.now().toString().substring(0, 7);
        ProfessorPayout payout = payoutRepository.findByProfessorIdAndMois(professorId, currentMonth)
                .orElseGet(() -> {
                    Professor professor = professorRepository.findByIdWithMatieres(professorId)
                            .orElseThrow(() -> new IllegalArgumentException("Professeur non trouvé avec l'ID: " + professorId));
                    ProfessorPayout p = new ProfessorPayout();
                    p.setProfessor(professor);
                    p.setMois(currentMonth);
                    p.setMontant(montant != null ? montant : computeRevenuEstime(professor));
                    return p;
                });
        payout.setStatut("Payé");
        payout.setPaymentDate(LocalDate.now());
        return mapToResponse(payoutRepository.save(payout));
    }

    @Transactional(readOnly = true)
    public ProfessorPayoutResponse getById(Long id) {
        return mapToResponse(payoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement professeur non trouvé avec l'ID: " + id)));
    }

    // Liste tous les professeurs pour le mois donné (par défaut le mois courant) :
    // - une vraie ligne ProfessorPayout si elle existe,
    // - sinon une ligne "virtuelle" avec le montant calculé automatiquement (non enregistrée en base).
    @Transactional(readOnly = true)
    public List<ProfessorPayoutResponse> getAll(String statut, String mois, String search) {
        String targetMonth = (mois == null || mois.isEmpty() || mois.equals("all"))
                ? LocalDate.now().toString().substring(0, 7)
                : mois;

        List<ProfessorPayout> existing = payoutRepository.findByMois(targetMonth);
        Map<Long, ProfessorPayout> byProfessor = existing.stream()
                .collect(Collectors.toMap(p -> p.getProfessor().getId(), p -> p, (a, b) -> a));

        List<Professor> allProfessors = professorRepository.findAllWithMatieres();

        List<ProfessorPayoutResponse> result = new ArrayList<>();
        for (Professor professor : allProfessors) {
            ProfessorPayout existingPayout = byProfessor.get(professor.getId());
            if (existingPayout != null) {
                result.add(mapToResponse(existingPayout));
            } else {
                ProfessorPayoutResponse r = new ProfessorPayoutResponse();
                r.setProfessorId(professor.getId());
                r.setProfessorName(professor.getPrenom() + " " + professor.getNom());
                r.setMois(targetMonth);
                r.setMontant(computeRevenuEstime(professor));
                r.setStatut("Non payé");
                r.setVirtual(true);
                result.add(r);
            }
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            result = result.stream()
                    .filter(r -> r.getProfessorName() != null && r.getProfessorName().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }
        if (statut != null && !statut.isEmpty() && !statut.equals("all")) {
            result = result.stream().filter(r -> statut.equals(r.getStatut())).collect(Collectors.toList());
        }

        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        String currentMonth = LocalDate.now().toString().substring(0, 7);

        stats.put("totalPaid", payoutRepository.getTotalByStatut("Payé"));
        stats.put("totalUnpaid", payoutRepository.getTotalByStatut("Non payé"));
        stats.put("countPaid", payoutRepository.countByStatut("Payé"));
        stats.put("total", payoutRepository.count());
        stats.put("currentMonthTotal", payoutRepository.getTotalByStatutAndMois("Payé", currentMonth));

        // Estimation totale (tous professeurs, calculée en direct — indépendante des lignes déjà enregistrées)
        double totalEstime = professorRepository.findAllWithMatieres().stream()
                .mapToDouble(this::computeRevenuEstime)
                .sum();
        stats.put("totalEstimeMoisCourant", totalEstime);

        return stats;
    }

    @Transactional
    public void delete(Long id) {
        if (!payoutRepository.existsById(id)) {
            throw new IllegalArgumentException("Paiement professeur non trouvé avec l'ID: " + id);
        }
        payoutRepository.deleteById(id);
    }

    private ProfessorPayoutResponse mapToResponse(ProfessorPayout payout) {
        ProfessorPayoutResponse r = new ProfessorPayoutResponse();
        r.setId(payout.getId());
        if (payout.getProfessor() != null) {
            r.setProfessorId(payout.getProfessor().getId());
            r.setProfessorName(payout.getProfessor().getPrenom() + " " + payout.getProfessor().getNom());
        }
        r.setMois(payout.getMois());
        r.setMontant(payout.getMontant());
        r.setStatut(payout.getStatut());
        r.setPaymentDate(payout.getPaymentDate());
        r.setNotes(payout.getNotes());
        r.setVirtual(false);
        r.setCreatedAt(payout.getCreatedAt());
        r.setUpdatedAt(payout.getUpdatedAt());
        return r;
    }
}
