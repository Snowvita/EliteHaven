package com.hms.elite_haven.dao.entity;

import java.sql.Timestamp;

import com.hms.elite_haven.utils.PaymentMethod;
import com.hms.elite_haven.utils.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingEntity booking;

    @Positive(message = "Amount must be positive")
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull(message = "Payment method is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @NotNull(message = "Payment status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_date")
    private Timestamp paymentDate = new Timestamp(System.currentTimeMillis());

    @Column(name = "transaction_id")
    private String transactionId;

    // Refund fields
    @Column(name = "is_refunded")
    private Boolean isRefunded = false;

    @Column(name = "refund_amount")
    private Double refundAmount = 0.0;

    @Column(name = "refund_date")
    private Timestamp refundDate;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
