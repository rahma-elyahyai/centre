package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.StaffPaymentRequest;
import com.warriors.centre.dto.StaffPaymentResponse;
import com.warriors.centre.service.StaffPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff-payments")
@CrossOrigin(origins = "*")
public class StaffPaymentController {

    private final StaffPaymentService service;

    public StaffPaymentController(StaffPaymentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffPaymentResponse>> create(@Valid @RequestBody StaffPaymentRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement employé créé avec succès", service.create(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffPaymentResponse>> update(@PathVariable Long id, @Valid @RequestBody StaffPaymentRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement employé mis à jour avec succès", service.update(id, request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/mark-paid")
    public ResponseEntity<ApiResponse<StaffPaymentResponse>> markAsPaid(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement marqué comme payé", service.markAsPaid(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffPaymentResponse>> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement employé récupéré", service.getById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffPaymentResponse>>> getAll(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Paiements employés récupérés", service.getAll(statut, search)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", service.getStats()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement employé supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
