// src/main/java/com/warriors/centre/service/StudentService.java
package com.warriors.centre.service;

import com.warriors.centre.dto.StudentRequest;
import com.warriors.centre.dto.StudentResponse;
import com.warriors.centre.entity.Student;
import com.warriors.centre.repository.StudentRepository;
import com.warriors.centre.entity.Payment;
import com.warriors.centre.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    
    private static final Logger log = LoggerFactory.getLogger(StudentService.class);
    
    private final StudentRepository studentRepository;
    private final PaymentRepository paymentRepository; // ← AJOUTER
    
    public StudentService(StudentRepository studentRepository, PaymentRepository paymentRepository) {
        this.studentRepository = studentRepository;
        this.paymentRepository = paymentRepository;
    }
    
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        log.info("Creating new student: {} {}", request.getPrenom(), request.getNom());
        
        // Vérifier l'unicité de l'email si fourni
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (studentRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Un étudiant avec cet email existe déjà");
            }
        }
        
        // Vérifier l'unicité du téléphone
        if (studentRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Un étudiant avec ce numéro de téléphone existe déjà");
        }
        
        Student student = Student.builder()
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .phoneNumber(request.getPhoneNumber().trim())
                .parentPhone(request.getParentPhone().trim())
                .niveau(request.getNiveau().trim())
                .filiere(request.getFiliere().trim())
                .etablissement(request.getEtablissement().trim())
                .dateInscription(request.getDateInscription() != null ? 
                        request.getDateInscription() : LocalDate.now())
                .matieres(request.getMatieres() != null ? request.getMatieres() : List.of())
                .build();
        
        Student savedStudent = studentRepository.save(student);
        log.info("Student created successfully with ID: {}", savedStudent.getId());
        createDefaultPayment(savedStudent);

        return mapToResponse(savedStudent);
    }
    
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        log.info("Updating student with ID: {}", id);
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + id));
        
        // Vérifier l'unicité de l'email (exclure l'étudiant actuel)
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            studentRepository.findByEmail(request.getEmail())
                    .ifPresent(existingStudent -> {
                        if (!existingStudent.getId().equals(id)) {
                            throw new IllegalArgumentException("Un étudiant avec cet email existe déjà");
                        }
                    });
        }
        
        // Vérifier l'unicité du téléphone (exclure l'étudiant actuel)
        studentRepository.findByPhoneNumber(request.getPhoneNumber())
                .ifPresent(existingStudent -> {
                    if (!existingStudent.getId().equals(id)) {
                        throw new IllegalArgumentException("Un étudiant avec ce numéro de téléphone existe déjà");
                    }
                });
        
        // Mettre à jour les champs
        student.setNom(request.getNom().trim());
        student.setPrenom(request.getPrenom().trim());
        student.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        student.setPhoneNumber(request.getPhoneNumber().trim());
        student.setParentPhone(request.getParentPhone().trim());
        student.setNiveau(request.getNiveau().trim());
        student.setFiliere(request.getFiliere().trim());
        student.setEtablissement(request.getEtablissement().trim());
        
        if (request.getDateInscription() != null) {
            student.setDateInscription(request.getDateInscription());
        }
        
        student.setMatieres(request.getMatieres() != null ? request.getMatieres() : List.of());
        
        Student updatedStudent = studentRepository.save(student);
        log.info("Student updated successfully with ID: {}", updatedStudent.getId());
        
        return mapToResponse(updatedStudent);
    }
    
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        log.info("Fetching student with ID: {}", id);
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + id));
        
        return mapToResponse(student);
    }
    
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(String niveau, String filiere, String search, Pageable pageable) {
        log.info("Fetching students - niveau: {}, filiere: {}, search: {}", niveau, filiere, search);
        
        Page<Student> students;
        
        // Normaliser les paramètres
        String normalizedNiveau = normalizeFilter(niveau);
        String normalizedFiliere = normalizeFilter(filiere);
        String normalizedSearch = normalizeFilter(search);
        
        // Appliquer les filtres appropriés
        if (normalizedNiveau == null && normalizedFiliere == null && normalizedSearch == null) {
            // Aucun filtre - retourner tous les étudiants
            students = studentRepository.findAll(pageable);
        } else {
            // Utiliser la requête de filtrage combinée
            students = studentRepository.filterStudents(
                    normalizedNiveau, 
                    normalizedFiliere, 
                    normalizedSearch, 
                    pageable
            );
        }
        
        return students.map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByGroup(String niveau, String filiere) {
        log.info("Fetching students by group - niveau: {}, filiere: {}", niveau, filiere);
        
        List<Student> students = studentRepository.findByNiveauAndFiliereWithSubjects(niveau, filiere);
        
        return students.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllNiveaux() {
        log.info("Fetching all distinct niveaux");
        return studentRepository.findDistinctNiveaux();
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllFilieres() {
        log.info("Fetching all distinct filieres");
        return studentRepository.findDistinctFilieres();
    }
    
    @Transactional(readOnly = true)
    public long countStudents() {
        return studentRepository.count();
    }
    
    @Transactional(readOnly = true)
    public long countStudentsByNiveau(String niveau) {
        return studentRepository.countByNiveau(niveau);
    }
    
    @Transactional(readOnly = true)
    public long countStudentsByFiliere(String filiere) {
        return studentRepository.countByFiliere(filiere);
    }
    
    @Transactional
    public void deleteStudent(Long id) {
        log.info("Deleting student with ID: {}", id);
        
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Étudiant non trouvé avec l'ID: " + id);
        }
        
        studentRepository.deleteById(id);
        log.info("Student deleted successfully with ID: {}", id);
    }
    
    // Méthodes utilitaires
    
    private String normalizeFilter(String value) {
        if (value == null || value.trim().isEmpty() || value.equalsIgnoreCase("all")) {
            return null;
        }
        return value.trim();
    }

    private void createDefaultPayment(Student student) {
        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setAmount(0.0); // montant à définir plus tard
        payment.setStatus("Non pay\u00e9");
        // Mois courant ex: "2025-02"
        payment.setPaymentMonth(LocalDate.now().toString().substring(0, 7));
        payment.setDueDate(LocalDate.now().plusDays(30));
        paymentRepository.save(payment);
    }
    
    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .nom(student.getNom())
                .prenom(student.getPrenom())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .parentPhone(student.getParentPhone())
                .niveau(student.getNiveau())
                .filiere(student.getFiliere())
                .etablissement(student.getEtablissement())
                .dateInscription(student.getDateInscription())
                .matieres(student.getMatieres() != null ? student.getMatieres() : List.of())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}