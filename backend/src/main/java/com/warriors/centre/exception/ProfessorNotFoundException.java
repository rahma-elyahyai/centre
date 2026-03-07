package com.warriors.centre.exception;

public class ProfessorNotFoundException extends RuntimeException {
    
    public ProfessorNotFoundException(Long id) {
        super("Professeur non trouvé avec l'ID: " + id);
    }
    
    public ProfessorNotFoundException(String message) {
        super(message);
    }
}