package com.microfinancemanager.microfinancemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "repayments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repayment_id")
    private Long repaymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column
    @CreationTimestamp
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Column(length = 100)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @lombok.Builder.Default
    private RepaymentStatus status = RepaymentStatus.PENDING;

    @Column(name = "receipt_number", unique = true, nullable = false, length = 100)
    private String receiptNumber;

    public enum PaymentMethod {
        BANK_TRANSFER, CARD, CASH, MOBILE_MONEY
    }

    public enum RepaymentStatus {
        PENDING, SUCCESSFUL, FAILED
    }
}
