package com.warriors.centre.service;

import com.warriors.centre.dto.CourseRequest;
import com.warriors.centre.dto.CourseResponse;
import com.warriors.centre.entity.Course;
import com.warriors.centre.entity.Professor;
import com.warriors.centre.exception.CourseNotFoundException;
import com.warriors.centre.exception.ProfessorNotFoundException;
import com.warriors.centre.repository.CourseRepository;
import com.warriors.centre.repository.ProfessorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final ProfessorRepository professorRepository;

    public CourseService(CourseRepository courseRepository, ProfessorRepository professorRepository) {
        this.courseRepository = courseRepository;
        this.professorRepository = professorRepository;
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new ProfessorNotFoundException(request.getProfessorId()));

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setSubject(request.getSubject());
        course.setLevel(request.getLevel());
        course.setProfessorId(request.getProfessorId());
        course.setProfessorName(professor.getPrenom() + " " + professor.getNom());
        course.setCourseType(request.getCourseType());
        course.setSchedule(request.getSchedule());
        course.setTime(request.getTime());
        course.setDuration(request.getDuration());
        course.setRoom(request.getRoom());
        course.setCapacity(request.getCapacity());
        course.setEnrolled(0);
        course.setPrice(request.getPrice());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setDescription(request.getDescription());
        course.setObjectives(request.getObjectives());
        course.setStatus(request.getStatus());

        return mapToResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        // ✅ findByIdWithObjectives charge objectives dans la session
        Course course = courseRepository.findByIdWithObjectives(id)
                .orElseThrow(() -> new CourseNotFoundException(id));

        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new ProfessorNotFoundException(request.getProfessorId()));

        course.setTitle(request.getTitle());
        course.setSubject(request.getSubject());
        course.setLevel(request.getLevel());
        course.setProfessorId(request.getProfessorId());
        course.setProfessorName(professor.getPrenom() + " " + professor.getNom());
        course.setCourseType(request.getCourseType());
        course.setSchedule(request.getSchedule());
        course.setTime(request.getTime());
        course.setDuration(request.getDuration());
        course.setRoom(request.getRoom());
        course.setCapacity(request.getCapacity());
        course.setPrice(request.getPrice());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setDescription(request.getDescription());
        course.setObjectives(request.getObjectives());
        course.setStatus(request.getStatus());

        return mapToResponse(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        // ✅ fetch join
        Course course = courseRepository.findByIdWithObjectives(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        return mapToResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(String level, String subject, Long professorId, String search) {
        List<Course> courses;

        if (search != null && !search.trim().isEmpty()) {
            // searchCourses utilise deja JOIN FETCH dans le repository
            courses = courseRepository.searchCourses(search);
        } else {
            // ✅ findAllWithObjectives au lieu de findAll()
            courses = courseRepository.findAllWithObjectives();
        }

        if (level != null && !level.trim().isEmpty() && !level.equals("all"))
            courses = courses.stream().filter(c -> level.equals(c.getLevel())).collect(Collectors.toList());

        if (subject != null && !subject.trim().isEmpty() && !subject.equals("all"))
            courses = courses.stream().filter(c -> subject.equals(c.getSubject())).collect(Collectors.toList());

        if (professorId != null)
            courses = courses.stream().filter(c -> professorId.equals(c.getProfessorId())).collect(Collectors.toList());

        return courses.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllSubjects() { return courseRepository.findAllSubjects(); }

    @Transactional(readOnly = true)
    public List<String> getAllLevels() { return courseRepository.findAllLevels(); }

    @Transactional(readOnly = true)
    public long countCourses() { return courseRepository.count(); }

    @Transactional(readOnly = true)
    public long countCoursesByStatus(String status) { return courseRepository.countByStatus(status); }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) throw new CourseNotFoundException(id);
        courseRepository.deleteById(id);
    }

    private CourseResponse mapToResponse(Course course) {
        CourseResponse r = new CourseResponse();
        r.setId(course.getId());
        r.setTitle(course.getTitle());
        r.setSubject(course.getSubject());
        r.setLevel(course.getLevel());
        r.setProfessorId(course.getProfessorId());
        r.setProfessorName(course.getProfessorName());
        r.setCourseType(course.getCourseType());
        r.setSchedule(course.getSchedule());
        r.setTime(course.getTime());
        r.setDuration(course.getDuration());
        r.setRoom(course.getRoom());
        r.setCapacity(course.getCapacity());
        r.setEnrolled(course.getEnrolled());
        r.setPrice(course.getPrice());
        r.setStartDate(course.getStartDate());
        r.setEndDate(course.getEndDate());
        r.setDescription(course.getDescription());
        r.setObjectives(course.getObjectives()); // ✅ safe — EAGER ou dans transaction
        r.setStatus(course.getStatus());
        r.setCreatedAt(course.getCreatedAt());
        r.setUpdatedAt(course.getUpdatedAt());
        return r;
    }
}