package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.EventRequest;
import com.warriors.centre.dto.EventResponse;
import com.warriors.centre.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        try {
            EventResponse event = eventService.createEvent(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Événement créé avec succès", event));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id, @Valid @RequestBody EventRequest request) {
        try {
            EventResponse event = eventService.updateEvent(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Événement mis à jour", event));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEvent(@PathVariable Long id) {
        try {
            EventResponse event = eventService.getEventById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Événement récupéré", event));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        try {
            List<EventResponse> events = eventService.getAllEvents(status, type, search);
            return ResponseEntity.ok(new ApiResponse<>(true, "Événements récupérés", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getUpcomingEvents() {
        List<EventResponse> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(new ApiResponse<>(true, "Prochains événements", events));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = eventService.getStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistiques", stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Événement supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}