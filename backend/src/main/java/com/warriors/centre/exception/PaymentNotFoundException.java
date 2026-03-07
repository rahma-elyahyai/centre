
// ═══════════════════════════════════════════════════════════
// 5. EXCEPTION - PaymentNotFoundException.java
// src/main/java/com/warriors/centre/exception/PaymentNotFoundException.java
// ═══════════════════════════════════════════════════════════

package com.warriors.centre.exception;

public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(Long id) {
        super("Paiement non trouvé avec l'ID: " + id);
    }
}