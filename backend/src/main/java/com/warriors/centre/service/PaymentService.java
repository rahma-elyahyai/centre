package com.warriors.centre.service;

import com.warriors.centre.dto.PaymentRequest;
import com.warriors.centre.dto.PaymentResponse;
import com.warriors.centre.entity.Payment;
import com.warriors.centre.entity.Student;
import com.warriors.centre.exception.PaymentNotFoundException;
import com.warriors.centre.repository.PaymentRepository;
import com.warriors.centre.repository.StudentRepository;
import com.warriors.centre.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          StudentRepository studentRepository,
                          CourseRepository courseRepository) {
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // ══════════════════════════════════════════════════════════
    //  CRÉER
    // ══════════════════════════════════════════════════════════
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {

        // ✅ On charge l'étudiant depuis la BDD — source unique de vérité
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException(
                        "Étudiant non trouvé avec l'ID: " + request.getStudentId()));

        Payment payment = new Payment();

        // ✅ On lie l'objet Student (plus de setStudentId / setStudentName)
        payment.setStudent(student);

        payment.setAmount(request.getAmount());
        payment.setCustomPrice(request.getCustomPrice());
        payment.setStatus(request.getStatus() != null ? request.getStatus() : "Non payé");
        payment.setPaymentDate(request.getPaymentDate());
        payment.setDueDate(request.getDueDate());
        payment.setPaymentMonth(request.getPaymentMonth());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNotes(request.getNotes());

        // Cours optionnel
        if (request.getCourseId() != null) {
            courseRepository.findById(request.getCourseId()).ifPresent(course -> {
                payment.setCourseId(course.getId());
                payment.setCourseTitle(course.getTitle());
            });
        }

        // Date de paiement automatique si statut = Payé
        if ("Payé".equals(payment.getStatus()) && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    // ══════════════════════════════════════════════════════════
    //  MODIFIER
    // ══════════════════════════════════════════════════════════
    @Transactional
    public PaymentResponse updatePayment(Long id, PaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));

        // Si l'étudiant change (cas rare mais possible)
        if (request.getStudentId() != null &&
                !request.getStudentId().equals(payment.getStudent().getId())) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException(
                            "Étudiant non trouvé avec l'ID: " + request.getStudentId()));
            payment.setStudent(student);
        }

        payment.setAmount(request.getAmount());
        payment.setCustomPrice(request.getCustomPrice());
        payment.setStatus(request.getStatus());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNotes(request.getNotes());

        if ("Payé".equals(request.getStatus()) && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        } else if (!"Payé".equals(request.getStatus())) {
            payment.setPaymentDate(request.getPaymentDate());
        }

        if (request.getDueDate() != null) {
            payment.setDueDate(request.getDueDate());
        }

        if (request.getPaymentMonth() != null) {
            payment.setPaymentMonth(request.getPaymentMonth());
        }

        // Cours optionnel
        if (request.getCourseId() != null) {
            courseRepository.findById(request.getCourseId()).ifPresent(course -> {
                payment.setCourseId(course.getId());
                payment.setCourseTitle(course.getTitle());
            });
        }

        Payment updated = paymentRepository.save(payment);
        return mapToResponse(updated);
    }

    // ══════════════════════════════════════════════════════════
    //  MARQUER PAYÉ
    // ══════════════════════════════════════════════════════════
    @Transactional
    public PaymentResponse markAsPaid(Long id, String paymentMethod) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));

        payment.setStatus("Payé");
        payment.setPaymentDate(LocalDate.now());
        if (paymentMethod != null) {
            payment.setPaymentMethod(paymentMethod);
        }

        Payment updated = paymentRepository.save(payment);
        return mapToResponse(updated);
    }

    // ══════════════════════════════════════════════════════════
    //  LIRE UN
    // ══════════════════════════════════════════════════════════
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));
        return mapToResponse(payment);
    }

    // ══════════════════════════════════════════════════════════
    //  LIRE TOUS (avec filtres côté service)
    // ══════════════════════════════════════════════════════════
// Dans PaymentService.java — remplace getAllPayments()

@Transactional(readOnly = true)
public List<PaymentResponse> getAllPayments(String status, String month, String search) {
    
    List<Payment> payments = paymentRepository.findAllWithStudent();
    
    // IDs des étudiants qui ont déjà un paiement
    Set<Long> studentsWithPayment = payments.stream()
        .map(p -> p.getStudent().getId())
        .collect(Collectors.toSet());

    // Étudiants sans aucun paiement → on les ajoute comme "Non payé" virtuel
    List<Student> allStudents = studentRepository.findAll();
    
    List<PaymentResponse> virtualUnpaid = allStudents.stream()
        .filter(s -> !studentsWithPayment.contains(s.getId()))
        .map(s -> {
            PaymentResponse r = new PaymentResponse();
            r.setStudentId(s.getId());
            r.setStudentName(s.getPrenom() + " " + s.getNom());
            r.setAmount(0.0);
            r.setStatus("Non pay\u00e9");
            r.setPaymentMonth(LocalDate.now().toString().substring(0, 7));
            return r;
        })
        .collect(Collectors.toList());

    // Fusionner vrais paiements + virtuels
    List<PaymentResponse> result = new java.util.ArrayList<>();
    result.addAll(payments.stream().map(this::mapToResponse).collect(Collectors.toList()));
    result.addAll(virtualUnpaid);

    // Filtres existants
    if (search != null && !search.trim().isEmpty()) {
        String q = search.toLowerCase();
        result = result.stream()
            .filter(p -> (p.getStudentName() != null && p.getStudentName().toLowerCase().contains(q))
                      || (p.getCourseTitle() != null && p.getCourseTitle().toLowerCase().contains(q)))
            .collect(Collectors.toList());
    }
    if (status != null && !status.isEmpty() && !status.equals("all")) {
        result = result.stream()
            .filter(p -> status.equals(p.getStatus()))
            .collect(Collectors.toList());
    }
    if (month != null && !month.isEmpty() && !month.equals("all")) {
        result = result.stream()
            .filter(p -> month.equals(p.getPaymentMonth()))
            .collect(Collectors.toList());
    }

    return result;
}
    // ══════════════════════════════════════════════════════════
    //  STATISTIQUES
    // ══════════════════════════════════════════════════════════

    // Constantes unicode-safe — evite la corruption "Payل" a la compilation
    private static final String STATUS_PAYE    = "Pay\u00e9";     // Payé
    private static final String STATUS_NONPAYE = "Non pay\u00e9"; // Non payé
    private static final String STATUS_PARTIEL = "Partiel";

    @Transactional(readOnly = true)
    public Map<String, Object> getFinanceStats() {
        Map<String, Object> stats = new HashMap<>();

        // ✅ Nouvelles méthodes avec paramètre :status (plus getTotalPaid/getTotalUnpaid)
        stats.put("totalPaid",        paymentRepository.getTotalByStatus(STATUS_PAYE));
        stats.put("totalUnpaid",      paymentRepository.getTotalByStatus(STATUS_NONPAYE));
        stats.put("countPaid",        paymentRepository.countByStatus(STATUS_PAYE));
        stats.put("countUnpaid",      paymentRepository.countByStatus(STATUS_NONPAYE));
        stats.put("countPartial",     paymentRepository.countByStatus(STATUS_PARTIEL));
        stats.put("total",            paymentRepository.count());

        // Remplace la ligne currentMonthTotal par :
String currentMonth = LocalDate.now().toString().substring(0, 7); // "2026-02"
stats.put("currentMonthTotal",
    paymentRepository.getTotalByStatusAndMonth(STATUS_PAYE, currentMonth));
        return stats;
    }

    // ══════════════════════════════════════════════════════════
    //  SUPPRIMER
    // ══════════════════════════════════════════════════════════
    @Transactional
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new PaymentNotFoundException(id);
        }
        paymentRepository.deleteById(id);
    }

    // ══════════════════════════════════════════════════════════
    //  MAPPER  entité → DTO
    // ══════════════════════════════════════════════════════════
    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());

        // ✅ Le nom est construit depuis l'objet Student lié — jamais copié
        if (payment.getStudent() != null) {
            response.setStudentId(payment.getStudent().getId());
            response.setStudentName(
                    payment.getStudent().getPrenom() + " " + payment.getStudent().getNom()
            );
        }

        response.setCourseId(payment.getCourseId());
        response.setCourseTitle(payment.getCourseTitle());
        response.setAmount(payment.getAmount());
        response.setCustomPrice(payment.getCustomPrice());
        response.setStatus(payment.getStatus());
        response.setPaymentDate(payment.getPaymentDate());
        response.setDueDate(payment.getDueDate());
        response.setPaymentMonth(payment.getPaymentMonth());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setNotes(payment.getNotes());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());
        return response;
    }
}