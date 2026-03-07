package com.warriors.centre.exception;

public class DuplicateEmailException extends RuntimeException {
    
    public DuplicateEmailException(String email) {
        super("Un professeur avec l'email " + email + " existe déjà");
    }
    
    public DuplicateEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}