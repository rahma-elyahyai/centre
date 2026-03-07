package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.CourseRequest;
import com.warriors.centre.dto.CourseResponse;
import com.warriors.centre.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    private final CourseService courseService;
    
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.createCourse(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cours créé avec succès", course));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.updateCourse(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cours mis à jour avec succès", course));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(@PathVariable Long id) {
        try {
            CourseResponse course = courseService.getCourseById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cours récupéré avec succès", course));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Long professorId,
            @RequestParam(required = false) String search) {
        
        try {
            List<CourseResponse> courses = courseService.getAllCourses(level, subject, professorId, search);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cours récupérés avec succès", courses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseService.countCourses());
        stats.put("ongoingCourses", courseService.countCoursesByStatus("En cours"));
        stats.put("upcomingCourses", courseService.countCoursesByStatus("À venir"));
        stats.put("subjects", courseService.getAllSubjects());
        stats.put("levels", courseService.getAllLevels());
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques récupérées", stats));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cours supprimé avec succès", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/options/subjects")
    public ResponseEntity<ApiResponse<List<String>>> getSubjects() {
        List<String> subjects = courseService.getAllSubjects();
        return ResponseEntity.ok(new ApiResponse<>(true, "Matières récupérées", subjects));
    }
    
    @GetMapping("/options/levels")
    public ResponseEntity<ApiResponse<List<String>>> getLevels() {
        List<String> levels = courseService.getAllLevels();
        return ResponseEntity.ok(new ApiResponse<>(true, "Niveaux récupérés", levels));
    }
}
