package com.microfinancemanager.microfinancemanager.dto.repayment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepaymentResponse {
    
    private Long repaymentId;
    private Long loanId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String method;
    private String reference;
    private String status;
    private String receiptNumber;
    private BigDecimal remainingBalance;
}
