package com.warriors.centre.service;

import com.warriors.centre.dto.CoursDto.*;
import com.warriors.centre.entity.Matiere;
import com.warriors.centre.entity.Module;       // ← import explicite — évite le conflit avec java.lang.Module
import com.warriors.centre.entity.Niveau;
import com.warriors.centre.entity.Seance;
import com.warriors.centre.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CoursService {

    private final NiveauRepository   niveauRepo;
    private final MatiereRepository  matiereRepo;
    private final ModuleRepository   moduleRepo;
    private final SeanceRepository   seanceRepo;

    public CoursService(NiveauRepository niveauRepo,
                        MatiereRepository matiereRepo,
                        ModuleRepository moduleRepo,
                        SeanceRepository seanceRepo) {
        this.niveauRepo  = niveauRepo;
        this.matiereRepo = matiereRepo;
        this.moduleRepo  = moduleRepo;
        this.seanceRepo  = seanceRepo;
    }

    // ─────────────────────────────────────────────────────────
    //  Mappers entité → DTO
    // ─────────────────────────────────────────────────────────

    private SeanceDto toSeanceDto(Seance s) {
        SeanceDto dto = new SeanceDto();
        dto.setId(s.getId());
        dto.setTitre(s.getTitre());
        dto.setSousTitre(s.getSousTitre());
        dto.setDescription(s.getDescription());
        dto.setVideoUrl(s.getVideoUrl());
        dto.setImageUrl(s.getImageUrl());
        dto.setDuree(s.getDuree());
        dto.setTypeSeance(s.getTypeSeance());
        dto.setDisponible(s.getDisponible());
        dto.setOrdre(s.getOrdre());
        return dto;
    }

    private ModuleDto toModuleDto(Module m) {
        List<SeanceDto> seances = new ArrayList<>();
        if (m.getSeances() != null) {
            for (Seance s : m.getSeances()) seances.add(toSeanceDto(s));
        }
        ModuleDto dto = new ModuleDto();
        dto.setId(m.getId());
        dto.setNom(m.getNom());
        dto.setIcon(m.getIcon());
        dto.setOrdre(m.getOrdre());
        dto.setSeances(seances);
        return dto;
    }

    private MatiereDto toMatiereDtoWithSeances(Matiere m) {
        // findByMatiereIdWithSeances récupère les modules avec leurs séances en JOIN FETCH
        List<Module> modulesEntities = moduleRepo.findByMatiereIdWithSeances(m.getId());
        List<ModuleDto> modules = new ArrayList<>();
        for (Module mod : modulesEntities) modules.add(toModuleDto(mod));

        MatiereDto dto = new MatiereDto();
        dto.setId(m.getId());
        dto.setNom(m.getNom());
        dto.setIcon(m.getIcon());
        dto.setColor(m.getColor());          // ← color mappé
        dto.setDescription(m.getDescription());
        dto.setOrdre(m.getOrdre());
        dto.setModules(modules);
        return dto;
    }

    private NiveauDto toNiveauDto(Niveau n) {
        // findByNiveauIdWithModules récupère les matières actives avec JOIN FETCH modules
        List<Matiere> matieresEntities = matiereRepo.findByNiveauIdWithModules(n.getId());
        List<MatiereDto> matieres = new ArrayList<>();
        for (Matiere m : matieresEntities) matieres.add(toMatiereDtoWithSeances(m));

        NiveauDto dto = new NiveauDto();
        dto.setId(n.getId());
        dto.setCode(n.getCode());
        dto.setLabel(n.getLabel());
        dto.setFullLabel(n.getFullLabel());
        dto.setEmoji(n.getEmoji());
        dto.setColorHex(n.getColorHex());
        dto.setOrdre(n.getOrdre());
        dto.setMatieres(matieres);
        return dto;
    }

    private NiveauSummaryDto toNiveauSummary(Niveau n) {
        NiveauSummaryDto dto = new NiveauSummaryDto();
        dto.setId(n.getId());
        dto.setCode(n.getCode());
        dto.setLabel(n.getLabel());
        dto.setFullLabel(n.getFullLabel());
        dto.setEmoji(n.getEmoji());
        dto.setColorHex(n.getColorHex());
        dto.setOrdre(n.getOrdre());
        return dto;
    }

    // ─────────────────────────────────────────────────────────
    //  Lecture (GET)
    // ─────────────────────────────────────────────────────────

    public List<NiveauDto> getAllNiveauxWithTree() {
        List<Niveau> niveaux = niveauRepo.findByActifTrueOrderByOrdreAsc();
        List<NiveauDto> result = new ArrayList<>();
        for (Niveau n : niveaux) result.add(toNiveauDto(n));
        return result;
    }

    public List<NiveauSummaryDto> getAllNiveauxSummary() {
        List<Niveau> niveaux = niveauRepo.findByActifTrueOrderByOrdreAsc();
        List<NiveauSummaryDto> result = new ArrayList<>();
        for (Niveau n : niveaux) result.add(toNiveauSummary(n));
        return result;
    }

    public NiveauDto getNiveauById(Long id) {
        Niveau n = niveauRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + id));
        return toNiveauDto(n);
    }

    public NiveauDto getNiveauByCode(String code) {
        Niveau n = niveauRepo.findByCodeAndActifTrue(code)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + code));
        return toNiveauDto(n);
    }

    public List<MatiereDto> getMatieresByNiveau(Long niveauId) {
        List<Matiere> matieres = matiereRepo.findByNiveauIdAndActifTrueOrderByOrdreAsc(niveauId);
        List<MatiereDto> result = new ArrayList<>();
        for (Matiere m : matieres) result.add(toMatiereDtoWithSeances(m));
        return result;
    }

    public List<ModuleDto> getModulesByMatiere(Long matiereId) {
        List<Module> modules = moduleRepo.findByMatiereIdAndActifTrueOrderByOrdreAsc(matiereId);
        List<ModuleDto> result = new ArrayList<>();
        for (Module m : modules) result.add(toModuleDto(m));
        return result;
    }

    public List<SeanceDto> getSeancesByModule(Long moduleId) {
        List<Seance> seances = seanceRepo.findByModuleIdOrderByOrdreAsc(moduleId);
        List<SeanceDto> result = new ArrayList<>();
        for (Seance s : seances) result.add(toSeanceDto(s));
        return result;
    }

    public List<SeanceDto> getSeancesDisponiblesByModule(Long moduleId) {
        List<Seance> seances = seanceRepo.findByModuleIdAndDisponibleTrueOrderByOrdreAsc(moduleId);
        List<SeanceDto> result = new ArrayList<>();
        for (Seance s : seances) result.add(toSeanceDto(s));
        return result;
    }

    // ─────────────────────────────────────────────────────────
    //  SAUVEGARDE COMPLÈTE — POST /api/cours/niveaux/save
    //
    //  Appelé par DistanceCourseManager.js → saveNiveaux().
    //  Stratégie upsert :
    //    id == null  → créer une nouvelle entité
    //    id == Long  → mettre à jour l'entité existante
    //  Les entités retirées de la liste → soft-delete (actif=false)
    // ─────────────────────────────────────────────────────────

    @Transactional
    public List<NiveauDto> saveAllNiveaux(List<SaveNiveauRequest> requests) {
        if (requests == null) requests = new ArrayList<>();

        // ── Soft-delete des niveaux supprimés côté admin ─────
        Set<Long> niveauIdsToKeep = requests.stream()
                .map(SaveNiveauRequest::getId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        for (Niveau existing : niveauRepo.findByActifTrueOrderByOrdreAsc()) {
            if (!niveauIdsToKeep.contains(existing.getId())) {
                existing.setActif(false);
                niveauRepo.save(existing);
            }
        }

        // ── Upsert niveaux ───────────────────────────────────
        for (int i = 0; i < requests.size(); i++) {
            SaveNiveauRequest req = requests.get(i);

            Niveau niveau = (req.getId() != null)
                    ? niveauRepo.findById(req.getId()).orElse(new Niveau())
                    : new Niveau();

            // Auto-générer le code si absent ou vide
            String code = (req.getCode() != null && !req.getCode().isBlank())
                    ? req.getCode().trim().toLowerCase().replaceAll("[^a-z0-9]+", "_")
                    : "niveau_" + System.currentTimeMillis() + "_" + i;
            niveau.setCode(code);

            niveau.setLabel(safe(req.getLabel()));
            niveau.setFullLabel(req.getFullLabel());
            niveau.setEmoji(req.getEmoji());
            niveau.setColorHex(req.getColorHex());
            niveau.setOrdre(i);
            niveau.setActif(true);
            niveau = niveauRepo.save(niveau);

            saveMatieres(niveau, req.getMatieres());
        }

        return getAllNiveauxWithTree();
    }

    // ── Helpers upsert ───────────────────────────────────────

    private void saveMatieres(Niveau niveau, List<SaveMatiereRequest> reqs) {
        if (reqs == null) reqs = new ArrayList<>();

        Set<Long> idsToKeep = reqs.stream()
                .map(SaveMatiereRequest::getId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        // Soft-delete des matières retirées
        for (Matiere existing : matiereRepo.findByNiveauIdAndActifTrueOrderByOrdreAsc(niveau.getId())) {
            if (!idsToKeep.contains(existing.getId())) {
                existing.setActif(false);
                matiereRepo.save(existing);
            }
        }

        for (int i = 0; i < reqs.size(); i++) {
            SaveMatiereRequest req = reqs.get(i);

            Matiere matiere = (req.getId() != null)
                    ? matiereRepo.findById(req.getId()).orElse(new Matiere())
                    : new Matiere();

            matiere.setNom(safe(req.getNom()));
            matiere.setIcon(req.getIcon());
            matiere.setColor(req.getColor());
            matiere.setDescription(req.getDescription());
            matiere.setOrdre(i);
            matiere.setActif(true);
            matiere.setNiveau(niveau);
            matiere = matiereRepo.save(matiere);

            saveModules(matiere, req.getModules());
        }
    }

    private void saveModules(Matiere matiere, List<SaveModuleRequest> reqs) {
        if (reqs == null) reqs = new ArrayList<>();

        Set<Long> idsToKeep = reqs.stream()
                .map(SaveModuleRequest::getId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        // Soft-delete des modules retirés
        for (Module existing : moduleRepo.findByMatiereIdAndActifTrueOrderByOrdreAsc(matiere.getId())) {
            if (!idsToKeep.contains(existing.getId())) {
                existing.setActif(false);
                moduleRepo.save(existing);
            }
        }

        for (int i = 0; i < reqs.size(); i++) {
            SaveModuleRequest req = reqs.get(i);

            Module module = (req.getId() != null)
                    ? moduleRepo.findById(req.getId()).orElse(new Module())
                    : new Module();

            module.setNom(safe(req.getNom()));
            module.setIcon(req.getIcon());
            module.setOrdre(i);
            module.setActif(true);
            module.setMatiere(matiere);
            module = moduleRepo.save(module);

            saveSeances(module, req.getSeances());
        }
    }

    private void saveSeances(Module module, List<SaveSeanceRequest> reqs) {
        if (reqs == null) reqs = new ArrayList<>();

        Set<Long> idsToKeep = reqs.stream()
                .map(SaveSeanceRequest::getId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        // Suppression dure des séances retirées (pas de champ actif sur Seance)
        for (Seance existing : seanceRepo.findByModuleIdOrderByOrdreAsc(module.getId())) {
            if (!idsToKeep.contains(existing.getId())) {
                seanceRepo.delete(existing);
            }
        }

        for (int i = 0; i < reqs.size(); i++) {
            SaveSeanceRequest req = reqs.get(i);

            Seance seance = (req.getId() != null)
                    ? seanceRepo.findById(req.getId()).orElse(new Seance())
                    : new Seance();

            seance.setTitre(safe(req.getTitre()));
            seance.setSousTitre(req.getSousTitre());
            seance.setDescription(req.getDescription());
            seance.setVideoUrl(req.getVideoUrl());
            seance.setImageUrl(req.getImageUrl());
            seance.setDuree(req.getDuree());
            seance.setTypeSeance(req.getTypeSeance() != null ? req.getTypeSeance() : "cours");
            seance.setDisponible(Boolean.TRUE.equals(req.getDisponible()));
            seance.setOrdre(i);
            seance.setModule(module);
            seanceRepo.save(seance);
        }
    }

    private String safe(String s) {
        return s != null ? s.trim() : "";
    }
}