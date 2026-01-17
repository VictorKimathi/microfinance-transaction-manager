package com.microfinancemanager.microfinancemanager.dto.loan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanResponse {
    
    private Long loanId;
    private Long userId;
    private Long accountId;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer repaymentPeriodMonths;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime startDate;
    private LocalDate dueDate;
    private BigDecimal principalBalance;
    private BigDecimal totalRepaid;
}
