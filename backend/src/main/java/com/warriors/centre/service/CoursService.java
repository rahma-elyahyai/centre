package com.warriors.centre.service;

import com.warriors.centre.dto.CoursDto.MatiereDto;
import com.warriors.centre.dto.CoursDto.ModuleDto;
import com.warriors.centre.dto.CoursDto.NiveauDto;
import com.warriors.centre.dto.CoursDto.NiveauSummaryDto;
import com.warriors.centre.dto.CoursDto.SeanceDto;
import com.warriors.centre.entity.Matiere;
import com.warriors.centre.entity.Module;
import com.warriors.centre.entity.Niveau;
import com.warriors.centre.entity.Seance;
import com.warriors.centre.repository.MatiereRepository;
import com.warriors.centre.repository.ModuleRepository;
import com.warriors.centre.repository.NiveauRepository;
import com.warriors.centre.repository.SeanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CoursService {

    private final NiveauRepository niveauRepo;
    private final MatiereRepository matiereRepo;
    private final ModuleRepository moduleRepo;
    private final SeanceRepository seanceRepo;

    public CoursService(NiveauRepository niveauRepo,
                        MatiereRepository matiereRepo,
                        ModuleRepository moduleRepo,
                        SeanceRepository seanceRepo) {
        this.niveauRepo = niveauRepo;
        this.matiereRepo = matiereRepo;
        this.moduleRepo = moduleRepo;
        this.seanceRepo = seanceRepo;
    }

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
            for (Seance s : m.getSeances()) {
                seances.add(toSeanceDto(s));
            }
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
        List<Module> modulesEntities = moduleRepo.findByMatiereIdWithSeances(m.getId());

        List<ModuleDto> modules = new ArrayList<>();
        for (Module module : modulesEntities) {
            modules.add(toModuleDto(module));
        }

        MatiereDto dto = new MatiereDto();
        dto.setId(m.getId());
        dto.setNom(m.getNom());
        dto.setIcon(m.getIcon());
        dto.setDescription(m.getDescription());
        dto.setOrdre(m.getOrdre());
        dto.setModules(modules);
        return dto;
    }

    private NiveauDto toNiveauDto(Niveau n) {
        List<Matiere> matieresEntities = matiereRepo.findByNiveauIdWithModules(n.getId());

        List<MatiereDto> matieres = new ArrayList<>();
        for (Matiere m : matieresEntities) {
            matieres.add(toMatiereDtoWithSeances(m));
        }

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

    public List<NiveauDto> getAllNiveauxWithTree() {
        List<Niveau> niveaux = niveauRepo.findByActifTrueOrderByOrdreAsc();
        List<NiveauDto> result = new ArrayList<>();

        for (Niveau n : niveaux) {
            result.add(toNiveauDto(n));
        }

        return result;
    }

    public List<NiveauSummaryDto> getAllNiveauxSummary() {
        List<Niveau> niveaux = niveauRepo.findByActifTrueOrderByOrdreAsc();
        List<NiveauSummaryDto> result = new ArrayList<>();

        for (Niveau n : niveaux) {
            result.add(toNiveauSummary(n));
        }

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
        List<Matiere> matieres = matiereRepo.findByNiveauIdWithModules(niveauId);
        List<MatiereDto> result = new ArrayList<>();

        for (Matiere m : matieres) {
            result.add(toMatiereDtoWithSeances(m));
        }

        return result;
    }

    public List<ModuleDto> getModulesByMatiere(Long matiereId) {
        List<Module> modules = moduleRepo.findByMatiereIdWithSeances(matiereId);
        List<ModuleDto> result = new ArrayList<>();

        for (Module m : modules) {
            result.add(toModuleDto(m));
        }

        return result;
    }

    public List<SeanceDto> getSeancesByModule(Long moduleId) {
        List<Seance> seances = seanceRepo.findByModuleIdOrderByOrdreAsc(moduleId);
        List<SeanceDto> result = new ArrayList<>();

        for (Seance s : seances) {
            result.add(toSeanceDto(s));
        }

        return result;
    }

    public List<SeanceDto> getSeancesDisponiblesByModule(Long moduleId) {
        List<Seance> seances = seanceRepo.findByModuleIdAndDisponibleTrueOrderByOrdreAsc(moduleId);
        List<SeanceDto> result = new ArrayList<>();

        for (Seance s : seances) {
            result.add(toSeanceDto(s));
        }

        return result;
    }
}