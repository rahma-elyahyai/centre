// src/main/java/com/warriors/centre/controller/DashboardController.java
package com.warriors.centre.controller;

import com.warriors.centre.dto.ApiResponse;
import com.warriors.centre.dto.DashboardResponse;
import com.warriors.centre.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Toutes les données en un appel (optimisé)
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        try {
            DashboardResponse data = dashboardService.getDashboardData();
            return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard chargé", data));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}