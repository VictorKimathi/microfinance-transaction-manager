package com.microfinancemanager.microfinancemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long loanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "repayment_period_months", nullable = false)
    private Integer repaymentPeriodMonths;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @lombok.Builder.Default
    private LoanStatus status = LoanStatus.PENDING;

    @Column(name = "request_date")
    @CreationTimestamp
    private LocalDateTime requestDate;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "principal_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal principalBalance;

    @Column(name = "total_repaid", precision = 15, scale = 2)
    @lombok.Builder.Default
    private BigDecimal totalRepaid = BigDecimal.ZERO;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL)
    private List<Repayment> repayments;

    public enum LoanStatus {
        PENDING, APPROVED, REJECTED, ACTIVE, PAID_OFF, DEFAULTED
    }
}
