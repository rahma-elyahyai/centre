package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.EquipmentRequest;
import com.warriors.centre.dto.EquipmentResponse;
import com.warriors.centre.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EquipmentResponse>> create(@Valid @RequestBody EquipmentRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Équipement créé avec succès", service.create(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> update(@PathVariable Long id, @Valid @RequestBody EquipmentRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Équipement mis à jour avec succès", service.update(id, request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Équipement récupéré", service.getById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EquipmentResponse>>> getAll(
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Équipements récupérés", service.getAll(categorie, search)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", service.getStats()));
    }

    @GetMapping("/options/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Catégories récupérées", service.getAllCategories()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Équipement supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
