package com.warriors.centre.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(Long id) {
        super("Événement non trouvé avec l'ID: " + id);
    }
}