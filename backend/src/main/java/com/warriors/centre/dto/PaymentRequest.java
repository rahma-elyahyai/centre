package com.warriors.centre.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class PaymentRequest {

    @NotNull(message = "L'étudiant est requis")
    private Long studentId;

    private Long courseId;

    @NotNull(message = "Le montant est requis")
    @Min(value = 0, message = "Le montant doit être positif")
    private Double amount;

    private Double customPrice;

    private String status;

    private LocalDate paymentDate;

    private LocalDate dueDate;

    private String paymentMonth;

    private String paymentMethod;

    private String notes;

    public PaymentRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getCustomPrice() { return customPrice; }
    public void setCustomPrice(Double customPrice) { this.customPrice = customPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPaymentMonth() { return paymentMonth; }
    public void setPaymentMonth(String paymentMonth) { this.paymentMonth = paymentMonth; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
