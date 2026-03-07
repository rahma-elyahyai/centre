package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.ProfessorRequest;
import com.warriors.centre.dto.ProfessorResponse;
import com.warriors.centre.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;  // ✅ AJOUTER
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;  // ✅ AJOUTER

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/professors")
@CrossOrigin(origins = "*")
public class ProfessorController {
    
    private final ProfessorService professorService;
    
    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfessorResponse>> createProfessor(
            @RequestPart("data") @Valid ProfessorRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        try {
            ProfessorResponse professor = professorService.createProfessor(request, photo);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeur créé avec succès", professor));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfessorResponse>> updateProfessor(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProfessorRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        try {
            ProfessorResponse professor = professorService.updateProfessor(id, request, photo);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeur mis à jour avec succès", professor));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfessorResponse>> getProfessor(@PathVariable Long id) {
        try {
            ProfessorResponse professor = professorService.getProfessorById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeur récupéré avec succès", professor));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProfessorResponse>>> getAllProfessors(
            @RequestParam(required = false) String specialite,
            @RequestParam(required = false) String search) {
        
        try {
            List<ProfessorResponse> professors = professorService.getAllProfessors(specialite, search);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeurs récupérés avec succès", professors));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/specialite/{specialite}")
    public ResponseEntity<ApiResponse<List<ProfessorResponse>>> getProfessorsBySpecialite(
            @PathVariable String specialite) {
        
        try {
            List<ProfessorResponse> professors = professorService.getProfessorsBySpecialite(specialite);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeurs par spécialité récupérés", professors));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProfessors", professorService.countProfessors());
        stats.put("specialites", professorService.getAllSpecialites());
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", stats));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProfessor(@PathVariable Long id) {
        try {
            professorService.deleteProfessor(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Professeur supprimé avec succès", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/options/specialites")
    public ResponseEntity<ApiResponse<List<String>>> getSpecialites() {
        List<String> specialites = professorService.getAllSpecialites();
        return ResponseEntity.ok(new ApiResponse<>(true, "Spécialités récupérées", specialites));
    }
}