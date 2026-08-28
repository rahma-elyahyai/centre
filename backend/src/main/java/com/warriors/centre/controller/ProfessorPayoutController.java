package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.ProfessorPayoutRequest;
import com.warriors.centre.dto.ProfessorPayoutResponse;
import com.warriors.centre.service.ProfessorPayoutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/professor-payouts")
@CrossOrigin(origins = "*")
public class ProfessorPayoutController {

    private final ProfessorPayoutService service;

    public ProfessorPayoutController(ProfessorPayoutService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProfessorPayoutResponse>> create(@Valid @RequestBody ProfessorPayoutRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement professeur créé avec succès", service.create(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfessorPayoutResponse>> update(@PathVariable Long id, @Valid @RequestBody ProfessorPayoutRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement professeur mis à jour avec succès", service.update(id, request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Marque payée une ligne déjà enregistrée en base (id réel)
    @PatchMapping("/{id}/mark-paid")
    public ResponseEntity<ApiResponse<ProfessorPayoutResponse>> markAsPaid(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement marqué comme payé", service.markAsPaid(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Marque payée la ligne du mois courant pour un professeur — crée la ligne si elle n'existe pas encore
    // (cas d'une ligne "virtuelle" affichée avec le montant calculé automatiquement)
    @PatchMapping("/professor/{professorId}/mark-paid")
    public ResponseEntity<ApiResponse<ProfessorPayoutResponse>> markAsPaidForCurrentMonth(
            @PathVariable Long professorId,
            @RequestParam(required = false) Double montant) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement marqué comme payé", service.markAsPaidForCurrentMonth(professorId, montant)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfessorPayoutResponse>> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement professeur récupéré", service.getById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProfessorPayoutResponse>>> getAll(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String mois,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Paiements professeurs récupérés", service.getAll(statut, mois, search)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", service.getStats()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement professeur supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
