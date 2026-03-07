package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.PaymentRequest;
import com.warriors.centre.dto.PaymentResponse;
import com.warriors.centre.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
        try {
            PaymentResponse payment = paymentService.createPayment(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement créé avec succès", payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        try {
            PaymentResponse payment = paymentService.updatePayment(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement mis à jour avec succès", payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/mark-paid")
    public ResponseEntity<ApiResponse<PaymentResponse>> markAsPaid(
            @PathVariable Long id,
            @RequestParam(required = false) String paymentMethod) {
        try {
            PaymentResponse payment = paymentService.markAsPaid(id, paymentMethod);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement marqué comme payé", payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable Long id) {
        try {
            PaymentResponse payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement récupéré", payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String search) {
        try {
            List<PaymentResponse> payments = paymentService.getAllPayments(status, month, search);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiements récupérés", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = paymentService.getFinanceStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Paiement supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}