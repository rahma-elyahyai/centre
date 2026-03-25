package com.warriors.centre.controller;

import com.warriors.centre.dto.CoursDto.*;
import com.warriors.centre.service.CoursService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cours")
@CrossOrigin(origins = "*")   // Ajuster selon votre config CORS en production
public class CoursController {

    private final CoursService coursService;

    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux
    //  Retourne toute l'arborescence (niveaux + matières +
    //  modules + séances) en une seule requête.
    //  Appelé par CoursDistance.js ET CoursesList.js au chargement.
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
                            + e.getClass().getSimpleName() + " — " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    //  POST /api/cours/niveaux/save
    //
    //  Reçoit la liste complète des niveaux depuis l'admin
    //  (DistanceCourseManager.js → saveNiveaux()).
    //
    //  Body JSON attendu :
    //  [
    //    {
    //      "id": 1,                     ← null si nouveau niveau
    //      "label": "1ère Bac",
    //      "fullLabel": "Première Baccalauréat",
    //      "emoji": "📘",
    //      "colorHex": "#d4a747",
    //      "matieres": [
    //        {
    //          "id": null,              ← null si nouvelle matière
    //          "nom": "Physique-Chimie",
    //          "icon": "⚗️",
    //          "color": "#3b82f6",      ← couleur accent
    //          "description": "...",
    //          "modules": [
    //            {
    //              "id": null,
    //              "nom": "Électricité",
    //              "icon": "⚡",
    //              "seances": [
    //                {
    //                  "id": null,
    //                  "titre": "RC — Séance 1",
    //                  "typeSeance": "cours",
    //                  "disponible": true,
    //                  "videoUrl": "https://...",
    //                  "duree": "45 min"
    //                }
    //              ]
    //            }
    //          ]
    //        }
    //      ]
    //    }
    //  ]
    //
    //  Réponse : { "success": true, "data": [ ...NiveauDto ] }
    //  (même structure que GET /niveaux → rechargement automatique)
    // ────────────────────────────────────────────────────────
    @PostMapping("/niveaux/save")
    public ResponseEntity<ApiResponse<List<NiveauDto>>> saveNiveaux(
            @RequestBody List<SaveNiveauRequest> requests) {
        try {
            List<NiveauDto> saved = coursService.saveAllNiveaux(requests);
            return ResponseEntity.ok(ApiResponse.ok(saved));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(
                            "Erreur lors de la sauvegarde : "
                            + e.getClass().getSimpleName() + " — " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    //  GET /api/cours/niveaux/summary
    //  Liste légère (sans enfants) pour la navbar
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
    //  ex : /api/cours/niveaux/code/bac2
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