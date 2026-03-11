package com.warriors.centre.service;

import com.warriors.centre.dto.DashboardResponse;
import com.warriors.centre.dto.DashboardResponse.*;
import com.warriors.centre.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    // Constantes pour les statuts - evite l'encodage hardcode dans les queries
    private static final String STATUS_PAYE    = "Pay\u00e9";    // "Payé"
    private static final String STATUS_NONPAYE = "Non pay\u00e9"; // "Non payé"
    private static final String STATUS_PARTIEL = "Partiel";

    private final StudentRepository       studentRepository;
    private final ProfessorRepository     professorRepository;
    private final CourseRepository        courseRepository;
    private final EventRepository         eventRepository;
    private final PaymentRepository       paymentRepository;
    private final ActivityLogRepository   activityLogRepository;

    public DashboardService(
            StudentRepository studentRepository,
            ProfessorRepository professorRepository,
            CourseRepository courseRepository,
            EventRepository eventRepository,
            PaymentRepository paymentRepository,
            ActivityLogRepository activityLogRepository) {
        this.studentRepository     = studentRepository;
        this.professorRepository   = professorRepository;
        this.courseRepository      = courseRepository;
        this.eventRepository       = eventRepository;
        this.paymentRepository     = paymentRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();

        // ── Stats ────────────────────────────────────────────────
        DashboardStats stats = new DashboardStats();

        long totalStudents   = studentRepository.count();
        long totalProfessors = professorRepository.count();
        long totalCourses    = courseRepository.count();

        LocalDate firstDayThisMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate firstDayLastMonth = firstDayThisMonth.minusMonths(1);

        long studentsThisMonth = studentRepository.countByCreatedAtAfter(
                firstDayThisMonth.atStartOfDay());
        long studentsLastMonth = studentRepository.countByCreatedAtBetween(
                firstDayLastMonth.atStartOfDay(),
                firstDayThisMonth.atStartOfDay());

        long coursesThisMonth = courseRepository.countByCreatedAtAfter(
                firstDayThisMonth.atStartOfDay());

        // !! Utilise le parametre :status via unicode - evite la corruption "Payل"
        String currentMonth = LocalDate.now().toString().substring(0, 7);
        String lastMonth    = LocalDate.now().minusMonths(1).toString().substring(0, 7);

        Double monthRevenue     = paymentRepository.getTotalByStatusAndMonth(STATUS_PAYE, currentMonth);
        Double lastMonthRevenue = paymentRepository.getTotalByStatusAndMonth(STATUS_PAYE, lastMonth);
        Double totalPaid        = paymentRepository.getTotalByStatus(STATUS_PAYE);
        Double totalUnpaid      = paymentRepository.getTotalByStatus(STATUS_NONPAYE);

        stats.setTotalStudents(totalStudents);
        stats.setStudentsChange(formatChange(studentsThisMonth, studentsLastMonth));
        stats.setStudentsTrend(studentsThisMonth >= studentsLastMonth ? "up" : "down");

        stats.setTotalProfessors(totalProfessors);
        stats.setProfessorsChange("+" + totalProfessors);
        stats.setProfessorsTrend("up");

        stats.setTotalCourses(totalCourses);
        stats.setCoursesChange("+" + coursesThisMonth + " ce mois");
        stats.setCoursesTrend("up");

        stats.setMonthRevenue(monthRevenue  != null ? monthRevenue  : 0.0);
        stats.setTotalPaid(  totalPaid      != null ? totalPaid      : 0.0);
        stats.setTotalUnpaid(totalUnpaid    != null ? totalUnpaid    : 0.0);
        stats.setRevenueChange(formatRevenueChange(monthRevenue, lastMonthRevenue));
        stats.setRevenueTrend((monthRevenue != null && lastMonthRevenue != null
                && monthRevenue >= lastMonthRevenue) ? "up" : "down");

        response.setStats(stats);

        // ── Etudiants recents (5 derniers) ───────────────────────
        List<RecentStudent> recentStudents = studentRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(s -> {
                    RecentStudent rs = new RecentStudent();
                    rs.setId(s.getId());
                    rs.setPrenom(s.getPrenom());
                    rs.setNom(s.getNom());
                    rs.setEmail(s.getEmail());
                    rs.setNiveau(s.getNiveau());
                    rs.setFiliere(s.getFiliere());
                    rs.setStatut(s.getStatut() != null ? s.getStatut() : "Actif");
                    return rs;
                })
                .collect(Collectors.toList());
        response.setRecentStudents(recentStudents);

        // ── Activites recentes (10 dernieres) ────────────────────
        List<RecentActivity> recentActivities = activityLogRepository
                .findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(a -> {
                    RecentActivity ra = new RecentActivity();
                    ra.setType(a.getType());
                    ra.setLabel(a.getLabel());
                    ra.setUserName(a.getUserName());
                    ra.setCreatedAt(a.getCreatedAt());
                    return ra;
                })
                .collect(Collectors.toList());
        response.setRecentActivities(recentActivities);

        // ── Evenements a venir (3 prochains) ─────────────────────
        // Après
    List<UpcomingEvent> upcomingEvents = eventRepository
        .findTop3ByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now())
        .stream()
        .limit(3)
        .map(e -> {
            UpcomingEvent ue = new UpcomingEvent();
            ue.setId(e.getId());
            ue.setTitle(e.getTitle());
            ue.setEventDate(e.getEventDate());
            ue.setLieu(e.getLocation());                // ← corrigé
            ue.setRegisteredCount(e.getRegisteredCount() != null ? e.getRegisteredCount() : 0); // ← corrigé
            return ue;
        })
        .collect(Collectors.toList());
        response.setUpcomingEvents(upcomingEvents);

        return response;
    }

    // ── Helpers ──────────────────────────────────────────────
    private String formatChange(long thisMonth, long lastMonth) {
        if (lastMonth == 0) return "+" + thisMonth;
        long diff = thisMonth - lastMonth;
        return (diff >= 0 ? "+" : "") + diff;
    }

    private String formatRevenueChange(Double current, Double previous) {
        if (current == null || current == 0) return "0 MAD";
        if (previous == null || previous == 0) return "+" + String.format("%.0f", current) + " MAD";
        double pct = ((current - previous) / previous) * 100;
        return (pct >= 0 ? "+" : "") + String.format("%.1f", pct) + "%";
    }
}