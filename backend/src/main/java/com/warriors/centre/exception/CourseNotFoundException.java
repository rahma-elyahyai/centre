package com.warriors.centre.exception;

public class CourseNotFoundException extends RuntimeException {
    
    public CourseNotFoundException(Long id) {
        super("Cours non trouvé avec l'ID: " + id);
    }
    
    public CourseNotFoundException(String message) {
        super(message);
    }
}