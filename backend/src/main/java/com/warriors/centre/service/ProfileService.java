package com.warriors.centre.service;

import com.warriors.centre.dto.PasswordChangeRequest;
import com.warriors.centre.dto.ProfileResponse;
import com.warriors.centre.dto.ProfileUpdateRequest;
import com.warriors.centre.entity.User;
import com.warriors.centre.repository.UserRepository;
import com.warriors.centre.repository.StudentRepository;
import com.warriors.centre.repository.ProfessorRepository;
import com.warriors.centre.repository.CourseRepository;
import com.warriors.centre.repository.EventRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          StudentRepository studentRepository,
                          ProfessorRepository professorRepository,
                          CourseRepository courseRepository,
                          EventRepository eventRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository    = userRepository;
        this.studentRepository = studentRepository;
        this.professorRepository = professorRepository;
        this.courseRepository  = courseRepository;
        this.eventRepository   = eventRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getCurrentProfile() {
        User user = getAuthenticatedUser();
        return buildProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getAuthenticatedUser();

        // Vérifier unicité email si changé
        if (!user.getEmail().equals(request.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                throw new RuntimeException("Cet email est déjà utilisé par un autre compte.");
            });
        }

        user.setPrenom(request.getPrenom());
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());

        // Ces champs n'existent peut-être pas encore — utiliser réflexion ou les ajouter à User
        try {
            user.getClass().getMethod("setPhoneNumber", String.class).invoke(user, request.getPhoneNumber());
            user.getClass().getMethod("setBio", String.class).invoke(user, request.getBio());
            user.getClass().getMethod("setAvatarEmoji", String.class).invoke(user, request.getAvatarEmoji());
        } catch (Exception e) {
            // Champs non encore ajoutés — ignoré
        }

        User saved = userRepository.save(user);
        return buildProfileResponse(saved);
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getAuthenticatedUser();

        // Vérifier mot de passe actuel
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Le mot de passe actuel est incorrect.");
        }

        // Vérifier confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("La confirmation ne correspond pas au nouveau mot de passe.");
        }

        // Vérifier que le nouveau est différent de l'ancien
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("Le nouveau mot de passe doit être différent de l'ancien.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    private ProfileResponse buildProfileResponse(User user) {
        ProfileResponse r = new ProfileResponse();
        r.setId(user.getId());
        r.setPrenom(user.getPrenom());
        r.setNom(user.getNom());
        r.setFullName(user.getPrenom() + " " + user.getNom());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole() != null ? user.getRole().name() : "ADMIN");
        r.setIsEnabled(user.isEnabled());

        // Champs optionnels via réflexion
        try { r.setPhoneNumber((String) user.getClass().getMethod("getPhoneNumber").invoke(user)); } catch (Exception ignored) {}
        try { r.setBio((String) user.getClass().getMethod("getBio").invoke(user)); } catch (Exception ignored) {}
        try { r.setAvatarEmoji((String) user.getClass().getMethod("getAvatarEmoji").invoke(user)); } catch (Exception ignored) {}
        try { r.setCreatedAt((java.time.LocalDateTime) user.getClass().getMethod("getCreatedAt").invoke(user)); } catch (Exception ignored) {}
        try { r.setLastLogin((java.time.LocalDateTime) user.getClass().getMethod("getLastLogin").invoke(user)); } catch (Exception ignored) {}

        if (r.getAvatarEmoji() == null) r.setAvatarEmoji("👤");

        // Stats globales
        r.setTotalStudents(studentRepository.count());
        r.setTotalProfessors(professorRepository.count());
        r.setTotalCourses(courseRepository.count());
        r.setTotalEvents(eventRepository.count());

        return r;
    }
}
