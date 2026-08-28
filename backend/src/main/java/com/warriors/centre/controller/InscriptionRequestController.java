package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.InscriptionRequestRequest;
import com.warriors.centre.dto.InscriptionRequestResponse;
import com.warriors.centre.service.InscriptionRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inscription-requests")
@CrossOrigin(origins = "*")
public class InscriptionRequestController {

    private final InscriptionRequestService service;

    public InscriptionRequestController(InscriptionRequestService service) {
        this.service = service;
    }

    // Public — soumission depuis le site vitrine, aucune authentification requise
    @PostMapping
    public ResponseEntity<ApiResponse<InscriptionRequestResponse>> create(@Valid @RequestBody InscriptionRequestRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Demande d'inscription envoyée avec succès", service.create(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Tout le reste — réservé à l'admin (authentifié)
    @GetMapping
    public ResponseEntity<ApiResponse<List<InscriptionRequestResponse>>> getAll(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String modalite,
            @RequestParam(required = false) String search) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Demandes récupérées", service.getAll(statut, modalite, search)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>(false, "Erreur lors de la récupération : " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InscriptionRequestResponse>> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Demande récupérée", service.getById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<ApiResponse<InscriptionRequestResponse>> updateStatut(@PathVariable Long id, @RequestParam String statut) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Statut mis à jour", service.updateStatut(id, statut)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<InscriptionRequestResponse>> updateNotes(@PathVariable Long id, @RequestParam String notes) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Notes mises à jour", service.updateNotes(id, notes)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", service.getStats()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>(false, "Erreur lors de la récupération : " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Demande supprimée", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
