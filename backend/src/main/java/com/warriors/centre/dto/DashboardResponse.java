package com.warriors.centre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DashboardResponse {

    private DashboardStats       stats;
    private List<RecentStudent>  recentStudents;
    private List<RecentActivity> recentActivities;
    private List<UpcomingEvent>  upcomingEvents;

    public DashboardStats       getStats()            { return stats; }
    public void                 setStats(DashboardStats s)       { this.stats = s; }
    public List<RecentStudent>  getRecentStudents()   { return recentStudents; }
    public void                 setRecentStudents(List<RecentStudent> v)  { this.recentStudents = v; }
    public List<RecentActivity> getRecentActivities() { return recentActivities; }
    public void                 setRecentActivities(List<RecentActivity> v){ this.recentActivities = v; }
    public List<UpcomingEvent>  getUpcomingEvents()   { return upcomingEvents; }
    public void                 setUpcomingEvents(List<UpcomingEvent> v)  { this.upcomingEvents = v; }

    // ── STATS ────────────────────────────────────────────────
    public static class DashboardStats {
        private long   totalStudents;
        private String studentsChange;
        private String studentsTrend;

        private long   totalProfessors;
        private String professorsChange;
        private String professorsTrend;

        private long   totalCourses;
        private String coursesChange;
        private String coursesTrend;

        private double monthRevenue;
        private double totalPaid;
        private double totalUnpaid;
        private String revenueChange;
        private String revenueTrend;

        public long   getTotalStudents()     { return totalStudents; }
        public void   setTotalStudents(long v)    { this.totalStudents = v; }
        public String getStudentsChange()    { return studentsChange; }
        public void   setStudentsChange(String v) { this.studentsChange = v; }
        public String getStudentsTrend()     { return studentsTrend; }
        public void   setStudentsTrend(String v)  { this.studentsTrend = v; }

        public long   getTotalProfessors()   { return totalProfessors; }
        public void   setTotalProfessors(long v)  { this.totalProfessors = v; }
        public String getProfessorsChange()  { return professorsChange; }
        public void   setProfessorsChange(String v){ this.professorsChange = v; }
        public String getProfessorsTrend()   { return professorsTrend; }
        public void   setProfessorsTrend(String v) { this.professorsTrend = v; }

        public long   getTotalCourses()      { return totalCourses; }
        public void   setTotalCourses(long v)     { this.totalCourses = v; }
        public String getCoursesChange()     { return coursesChange; }
        public void   setCoursesChange(String v)  { this.coursesChange = v; }
        public String getCoursesTrend()      { return coursesTrend; }
        public void   setCoursesTrend(String v)   { this.coursesTrend = v; }

        public double getMonthRevenue()      { return monthRevenue; }
        public void   setMonthRevenue(double v)   { this.monthRevenue = v; }
        public double getTotalPaid()         { return totalPaid; }
        public void   setTotalPaid(double v)      { this.totalPaid = v; }
        public double getTotalUnpaid()       { return totalUnpaid; }
        public void   setTotalUnpaid(double v)    { this.totalUnpaid = v; }
        public String getRevenueChange()     { return revenueChange; }
        public void   setRevenueChange(String v)  { this.revenueChange = v; }
        public String getRevenueTrend()      { return revenueTrend; }
        public void   setRevenueTrend(String v)   { this.revenueTrend = v; }
    }

    // ── RECENT STUDENT ───────────────────────────────────────
    public static class RecentStudent {
        private Long   id;
        private String prenom;
        private String nom;
        private String email;
        private String niveau;
        private String filiere;
        private String statut;

        public Long   getId()       { return id; }
        public void   setId(Long v)       { this.id = v; }
        public String getPrenom()   { return prenom; }
        public void   setPrenom(String v) { this.prenom = v; }
        public String getNom()      { return nom; }
        public void   setNom(String v)    { this.nom = v; }
        public String getEmail()    { return email; }
        public void   setEmail(String v)  { this.email = v; }
        public String getNiveau()   { return niveau; }
        public void   setNiveau(String v) { this.niveau = v; }
        public String getFiliere()  { return filiere; }
        public void   setFiliere(String v){ this.filiere = v; }
        public String getStatut()   { return statut; }
        public void   setStatut(String v) { this.statut = v; }
    }

    // ── RECENT ACTIVITY ──────────────────────────────────────
    public static class RecentActivity {
        private String        type;
        private String        label;
        private String        userName;
        private LocalDateTime createdAt;

        public String        getType()      { return type; }
        public void          setType(String v)        { this.type = v; }
        public String        getLabel()     { return label; }
        public void          setLabel(String v)       { this.label = v; }
        public String        getUserName()  { return userName; }
        public void          setUserName(String v)    { this.userName = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void          setCreatedAt(LocalDateTime v){ this.createdAt = v; }
    }

    // ── UPCOMING EVENT ───────────────────────────────────────
    public static class UpcomingEvent {
    private Long      id;
    private String    title;
    private LocalDate eventDate;
    private String    lieu;           // garde le nom "lieu" pour le frontend AdminDashboard
    private int       registeredCount; // ← renommé depuis nbParticipants

    public Long      getId()                        { return id; }
    public void      setId(Long v)                  { this.id = v; }
    public String    getTitle()                     { return title; }
    public void      setTitle(String v)             { this.title = v; }
    public LocalDate getEventDate()                 { return eventDate; }
    public void      setEventDate(LocalDate v)      { this.eventDate = v; }
    public String    getLieu()                      { return lieu; }
    public void      setLieu(String v)              { this.lieu = v; }
    public int       getRegisteredCount()           { return registeredCount; }
    public void      setRegisteredCount(int v)      { this.registeredCount = v; }
}
}