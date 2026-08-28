package com.warriors.centre.service;

import com.warriors.centre.dto.ProfessorRateDto;
import com.warriors.centre.dto.ProfessorRequest;
import com.warriors.centre.dto.ProfessorResponse;
import com.warriors.centre.entity.Professor;
import com.warriors.centre.entity.ProfessorRate;
import com.warriors.centre.exception.DuplicateEmailException;
import com.warriors.centre.exception.ProfessorNotFoundException;
import com.warriors.centre.repository.ProfessorRepository;
import com.warriors.centre.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final CloudinaryService cloudinaryService;
    private final StudentRepository studentRepository;

    public ProfessorService(ProfessorRepository professorRepository,
                            CloudinaryService cloudinaryService,
                            StudentRepository studentRepository) {
        this.professorRepository = professorRepository;
        this.cloudinaryService = cloudinaryService;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public ProfessorResponse createProfessor(ProfessorRequest request, MultipartFile photo) {
        if (professorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        Double salaire = parseSalaire(request.getSalaire());

        Professor professor = Professor.builder()
                .nom(request.getNom()).prenom(request.getPrenom())
                .email(request.getEmail()).phoneNumber(request.getPhoneNumber())
                .specialite(request.getSpecialite()).experienceLevel(request.getExperienceLevel())
                .matieres(request.getMatieres()).diplome(request.getDiplome())
                .bio(request.getBio())
                .disponibilite(request.getDisponibilite() != null ? request.getDisponibilite() : "Disponible")
                .salaire(salaire)
                .dateRecrutement(request.getDateRecrutement() != null ? request.getDateRecrutement() : LocalDate.now())
                .avatarType(request.getAvatarType() != null ? request.getAvatarType() : "emoji")
                .avatarEmoji(request.getAvatarEmoji() != null ? request.getAvatarEmoji() : "\uD83D\uDC68\u200D\uD83C\uDFEB")
                .build();

        professor.setTarifs(buildTarifs(professor, request.getTarifs()));

        Professor saved = professorRepository.save(professor);

        if ("photo".equals(request.getAvatarType()) && photo != null && !photo.isEmpty()) {
            try {
                String photoUrl = cloudinaryService.uploadImage(photo, "warriors/professors");                saved.setPhotoUrl(photoUrl);
                saved = professorRepository.save(saved);
            } catch (IOException e) {
                throw new RuntimeException("Erreur upload photo: " + e.getMessage());
            }
        } else if ("photo".equals(request.getAvatarType()) && request.getPhotoUrl() != null) {
            saved.setPhotoUrl(request.getPhotoUrl());
            saved = professorRepository.save(saved);
        }

        return mapToResponse(saved);
    }

    @Transactional
    public ProfessorResponse updateProfessor(Long id, ProfessorRequest request, MultipartFile photo) {
        // ✅ findByIdWithMatieres pour charger la collection en session
        Professor professor = professorRepository.findByIdWithMatieres(id)
                .orElseThrow(() -> new ProfessorNotFoundException(id));

        boolean emailExists = professorRepository.findAll().stream()
                .anyMatch(p -> !p.getId().equals(id) && request.getEmail().equals(p.getEmail()));
        if (emailExists) throw new DuplicateEmailException(request.getEmail());

        Double salaire = parseSalaire(request.getSalaire());

        professor.setNom(request.getNom()); professor.setPrenom(request.getPrenom());
        professor.setEmail(request.getEmail()); professor.setPhoneNumber(request.getPhoneNumber());
        professor.setSpecialite(request.getSpecialite()); professor.setExperienceLevel(request.getExperienceLevel());
        professor.setMatieres(request.getMatieres()); professor.setDiplome(request.getDiplome());
        professor.setBio(request.getBio()); professor.setDisponibilite(request.getDisponibilite());
        professor.setSalaire(salaire);
        if (request.getDateRecrutement() != null) professor.setDateRecrutement(request.getDateRecrutement());

        professor.getTarifs().clear();
        professor.getTarifs().addAll(buildTarifs(professor, request.getTarifs()));

        String oldPhotoUrl = professor.getPhotoUrl();
        professor.setAvatarType(request.getAvatarType());

        if ("emoji".equals(request.getAvatarType())) {
            if (oldPhotoUrl != null) cloudinaryService.deleteImage(oldPhotoUrl);
            professor.setPhotoUrl(null);
            professor.setAvatarEmoji(request.getAvatarEmoji());
        } else if ("photo".equals(request.getAvatarType())) {
            if (photo != null && !photo.isEmpty()) {
                if (oldPhotoUrl != null) cloudinaryService.deleteImage(oldPhotoUrl);
                try {
                    professor.setPhotoUrl(cloudinaryService.uploadImage(photo, "warriors/professors"));                } catch (IOException e) {
                    throw new RuntimeException("Erreur upload photo: " + e.getMessage());
                }
            } else if (request.getPhotoUrl() != null) {
                professor.setPhotoUrl(request.getPhotoUrl());
            }
        }

        return mapToResponse(professorRepository.save(professor));
    }

    @Transactional(readOnly = true)
    public ProfessorResponse getProfessorById(Long id) {
        // ✅ Fetch join pour charger matieres
        Professor professor = professorRepository.findByIdWithMatieres(id)
                .orElseThrow(() -> new ProfessorNotFoundException(id));
        return mapToResponse(professor);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponse> getAllProfessors(String specialite, String search) {
        List<Professor> professors;

        if (search != null && !search.trim().isEmpty()) {
            // searchProfessors utilise déjà JOIN FETCH dans le repository
            professors = professorRepository.searchProfessors(search);
        } else {
            // ✅ findAllWithMatieres au lieu de findAll() — charge matieres en une requête
            professors = professorRepository.findAllWithMatieres();
        }

        if (specialite != null && !specialite.trim().isEmpty() && !specialite.equals("all")) {
            professors = professors.stream()
                    .filter(p -> specialite.equals(p.getSpecialite()))
                    .collect(Collectors.toList());
        }

        return professors.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllSpecialites() {
        return professorRepository.findAllWithMatieres().stream()
                .map(Professor::getSpecialite)
                .distinct().sorted().collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countProfessors() {
        return professorRepository.count();
    }

    @Transactional
    public void deleteProfessor(Long id) {
        Professor professor = professorRepository.findByIdWithMatieres(id)
                .orElseThrow(() -> new ProfessorNotFoundException(id));
        if (professor.getPhotoUrl() != null) cloudinaryService.deleteImage(professor.getPhotoUrl());        professorRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponse> getProfessorsBySpecialite(String specialite) {
        return professorRepository.findBySpecialite(specialite).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private Double parseSalaire(String salaireStr) {
        // Le salaire fixe est désormais optionnel — le revenu réel vient de `tarifs`
        if (salaireStr == null || salaireStr.trim().isEmpty()) return null;
        try {
            Double s = Double.parseDouble(salaireStr.trim());
            if (s < 0) throw new IllegalArgumentException("Le salaire ne peut pas être négatif");
            return s;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Le salaire doit être un nombre valide: " + salaireStr);
        }
    }

    // Construit les entités ProfessorRate à partir des lignes envoyées par le formulaire
    private List<ProfessorRate> buildTarifs(Professor professor, List<ProfessorRateDto.TarifRequest> tarifRequests) {
        List<ProfessorRate> tarifs = new ArrayList<>();
        if (tarifRequests == null) return tarifs;
        for (ProfessorRateDto.TarifRequest t : tarifRequests) {
            if (t.getMatiere() == null || t.getMatiere().trim().isEmpty()) continue;
            if (t.getNiveau() == null || t.getNiveau().trim().isEmpty()) continue;
            if (t.getMontantParEtudiant() == null) continue;
            tarifs.add(new ProfessorRate(professor, t.getMatiere().trim(), t.getNiveau().trim(), t.getMontantParEtudiant()));
        }
        return tarifs;
    }

    private ProfessorResponse mapToResponse(Professor professor) {
        ProfessorResponse r = new ProfessorResponse();
        r.setId(professor.getId());
        r.setNom(professor.getNom());
        r.setPrenom(professor.getPrenom());
        r.setEmail(professor.getEmail());
        r.setPhoneNumber(professor.getPhoneNumber());
        r.setSpecialite(professor.getSpecialite());
        r.setExperienceLevel(professor.getExperienceLevel());
        r.setMatieres(professor.getMatieres()); // ✅ safe — EAGER ou dans transaction
        r.setDiplome(professor.getDiplome());
        r.setBio(professor.getBio());
        r.setDisponibilite(professor.getDisponibilite());
        r.setSalaire(professor.getSalaire());
        r.setDateRecrutement(professor.getDateRecrutement());

        List<ProfessorRateDto.TarifResponse> tarifResponses = new ArrayList<>();
        double revenuTotal = 0.0;
        if (professor.getTarifs() != null) {
            for (ProfessorRate tarif : professor.getTarifs()) {
                long nbEtudiants = studentRepository.countByNiveauAndMatiere(tarif.getNiveau(), tarif.getMatiere());
                double revenuLigne = nbEtudiants * tarif.getMontantParEtudiant();
                revenuTotal += revenuLigne;

                ProfessorRateDto.TarifResponse tr = new ProfessorRateDto.TarifResponse();
                tr.setId(tarif.getId());
                tr.setMatiere(tarif.getMatiere());
                tr.setNiveau(tarif.getNiveau());
                tr.setMontantParEtudiant(tarif.getMontantParEtudiant());
                tr.setNombreEtudiants(nbEtudiants);
                tr.setRevenuCalcule(revenuLigne);
                tarifResponses.add(tr);
            }
        }
        r.setTarifs(tarifResponses);
        r.setRevenuMensuelEstime(revenuTotal);
        r.setAvatarType(professor.getAvatarType());
        r.setAvatarEmoji(professor.getAvatarEmoji());
        r.setPhotoUrl(professor.getPhotoUrl());
        r.setDisplayAvatar(professor.getDisplayAvatar());
        r.setCreatedAt(professor.getCreatedAt());
        r.setUpdatedAt(professor.getUpdatedAt());
        return r;
    }
}