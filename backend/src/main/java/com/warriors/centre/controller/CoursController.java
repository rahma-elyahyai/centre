package com.warriors.centre.controller;


import com.warriors.centre.dto.CoursDto.ApiResponse;
import com.warriors.centre.dto.CoursDto.MatiereDto;
import com.warriors.centre.dto.CoursDto.ModuleDto;
import com.warriors.centre.dto.CoursDto.NiveauDto;
import com.warriors.centre.dto.CoursDto.NiveauSummaryDto;
import com.warriors.centre.dto.CoursDto.SeanceDto;
import com.warriors.centre.service.CoursService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cours")
@CrossOrigin(origins = "*")   // Ajuster selon votre config CORS en production
public class CoursController {

    private final CoursService coursService;

    // Constructor injection
    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux
    //
    //  Retourne TOUTE l'arborescence en une seule requête.
    //  C'est l'endpoint principal appelé par le frontend.
    //
    //  Réponse :
    //  {
    //    "success": true,
    //    "data": [
    //      {
    //        "id": 1,
    //        "code": "bac2",
    //        "label": "2ème Bac",
    //        "fullLabel": "2ème Année Baccalauréat",
    //        "emoji": "🎓",
    //        "colorHex": "#d4a747",
    //        "matieres": [
    //          {
    //            "id": 1,
    //            "nom": "Physique-Chimie",
    //            "icon": "⚛️",
    //            "modules": [
    //              {
    //                "id": 1,
    //                "nom": "Électricité",
    //                "icon": "⚡",
    //                "seances": [
    //                  {
    //                    "id": 1,
    //                    "titre": "RC — Séance 1",
    //                    "sousTitre": "Circuit RC : charge & décharge",
    //                    "description": "...",
    //                    "videoUrl": "https://...",
    //                    "imageUrl": null,
    //                    "duree": "~45 min",
    //                    "typeSeance": "cours",
    //                    "disponible": true,
    //                    "ordre": 1
    //                  }
    //                ]
    //              }
    //            ]
    //          }
    //        ]
    //      }
    //    ]
    //  }
    // ────────────────────────────────────────────────────────
    @GetMapping("/niveaux")
public ResponseEntity<ApiResponse<List<NiveauDto>>> getAllNiveaux() {
    try {
        List<NiveauDto> data = coursService.getAllNiveauxWithTree();
        return ResponseEntity.ok(ApiResponse.ok(data));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error(
                        "Erreur lors du chargement des niveaux : "
                                + e.getClass().getName()
                                + " - "
                                + e.getMessage()
                ));
    }
}

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux/summary
    //  Liste légère sans enfants (pour la navbar)
    // ────────────────────────────────────────────────────────
    @GetMapping("/niveaux/summary")
    public ResponseEntity<ApiResponse<List<NiveauSummaryDto>>> getNiveauxSummary() {
        try {
            return ResponseEntity.ok(ApiResponse.ok(coursService.getAllNiveauxSummary()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux/{id}
    // ────────────────────────────────────────────────────────
    @GetMapping("/niveaux/{id}")
    public ResponseEntity<ApiResponse<NiveauDto>> getNiveauById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(coursService.getNiveauById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux/code/{code}
    //  ex: /api/cours/niveaux/code/bac2
    // ────────────────────────────────────────────────────────
    @GetMapping("/niveaux/code/{code}")
    public ResponseEntity<ApiResponse<NiveauDto>> getNiveauByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(coursService.getNiveauByCode(code)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux/{niveauId}/matieres
    // ────────────────────────────────────────────────────────
    @GetMapping("/niveaux/{niveauId}/matieres")
    public ResponseEntity<ApiResponse<List<MatiereDto>>> getMatieres(
            @PathVariable Long niveauId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(
                    coursService.getMatieresByNiveau(niveauId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/matieres/{matiereId}/modules
    // ────────────────────────────────────────────────────────
    @GetMapping("/matieres/{matiereId}/modules")
    public ResponseEntity<ApiResponse<List<ModuleDto>>> getModules(
            @PathVariable Long matiereId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(
                    coursService.getModulesByMatiere(matiereId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/modules/{moduleId}/seances
    // ────────────────────────────────────────────────────────
    @GetMapping("/modules/{moduleId}/seances")
    public ResponseEntity<ApiResponse<List<SeanceDto>>> getSeances(
            @PathVariable Long moduleId) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(
                    coursService.getSeancesByModule(moduleId)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}