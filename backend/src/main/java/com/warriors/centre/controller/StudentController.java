// src/main/java/com/warriors/centre/controller/StudentController.java
package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.StudentRequest;
import com.warriors.centre.dto.StudentResponse;
import com.warriors.centre.service.StudentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
//@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {
    
    private static final Logger log = LoggerFactory.getLogger(StudentController.class);
    
    private final StudentService studentService;
    
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentRequest request) {
        try {
            log.info("POST /api/students - Creating new student");
            StudentResponse student = studentService.createStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Étudiant créé avec succès", student));
        } catch (IllegalArgumentException e) {
            log.error("Error creating student: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating student", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la création de l'étudiant"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        try {
            log.info("PUT /api/students/{} - Updating student", id);
            StudentResponse student = studentService.updateStudent(id, request);
            return ResponseEntity.ok(ApiResponse.success("Étudiant mis à jour avec succès", student));
        } catch (IllegalArgumentException e) {
            log.error("Error updating student: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error updating student", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la mise à jour de l'étudiant"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudent(@PathVariable Long id) {
        try {
            log.info("GET /api/students/{} - Fetching student", id);
            StudentResponse student = studentService.getStudentById(id);
            return ResponseEntity.ok(ApiResponse.success("Étudiant récupéré avec succès", student));
        } catch (IllegalArgumentException e) {
            log.error("Student not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error fetching student", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération de l'étudiant"));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getAllStudents(
            @RequestParam(required = false) String niveau,
            @RequestParam(required = false) String filiere,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            log.info("GET /api/students - niveau: {}, filiere: {}, search: {}, page: {}, size: {}", 
                    niveau, filiere, search, page, size);
            
            // Créer le tri
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") 
                    ? Sort.Direction.ASC 
                    : Sort.Direction.DESC;
            Sort sort = Sort.by(direction, sortBy);
            
            // Créer le pageable
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Récupérer les étudiants
            Page<StudentResponse> students = studentService.getAllStudents(
                    niveau, filiere, search, pageable);
            
            return ResponseEntity.ok(ApiResponse.success("Étudiants récupérés avec succès", students));
        } catch (Exception e) {
            log.error("Error fetching students", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des étudiants"));
        }
    }
    
    @GetMapping("/group/{niveau}/{filiere}")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudentsByGroup(
            @PathVariable String niveau,
            @PathVariable String filiere) {
        try {
            log.info("GET /api/students/group/{}/{}", niveau, filiere);
            List<StudentResponse> students = studentService.getStudentsByGroup(niveau, filiere);
            return ResponseEntity.ok(ApiResponse.success("Étudiants par groupe récupérés", students));
        } catch (Exception e) {
            log.error("Error fetching students by group", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des étudiants"));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        try {
            log.info("GET /api/students/stats");
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", studentService.countStudents());
            stats.put("niveaux", studentService.getAllNiveaux());
            stats.put("filieres", studentService.getAllFilieres());
            
            return ResponseEntity.ok(ApiResponse.success("Statistiques récupérées", stats));
        } catch (Exception e) {
            log.error("Error fetching stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des statistiques"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        try {
            log.info("DELETE /api/students/{}", id);
            studentService.deleteStudent(id);
            return ResponseEntity.ok(ApiResponse.success("Étudiant supprimé avec succès", null));
        } catch (IllegalArgumentException e) {
            log.error("Error deleting student: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error deleting student", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la suppression de l'étudiant"));
        }
    }
    
    @GetMapping("/options/niveaux")
    public ResponseEntity<ApiResponse<List<String>>> getNiveaux() {
        try {
            log.info("GET /api/students/options/niveaux");
            List<String> niveaux = studentService.getAllNiveaux();
            return ResponseEntity.ok(ApiResponse.success("Niveaux récupérés", niveaux));
        } catch (Exception e) {
            log.error("Error fetching niveaux", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des niveaux"));
        }
    }
    
    @GetMapping("/options/filieres")
    public ResponseEntity<ApiResponse<List<String>>> getFilieres() {
        try {
            log.info("GET /api/students/options/filieres");
            List<String> filieres = studentService.getAllFilieres();
            return ResponseEntity.ok(ApiResponse.success("Filières récupérées", filieres));
        } catch (Exception e) {
            log.error("Error fetching filieres", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des filières"));
        }
    }
    
    // Gestion des erreurs de validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Erreur de validation",
                        (existing, replacement) -> existing
                ));
        
        log.error("Validation error: {}", errors);
        
        ApiResponse<Map<String, String>> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage("Erreur de validation");
        response.setData(errors);
        
        return ResponseEntity.badRequest().body(response);
    }
    
    // Gestion des erreurs générales
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Une erreur inattendue s'est produite"));
    }
}