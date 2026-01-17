package com.microfinancemanager.microfinancemanager.dto.repayment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRepaymentRequest {
    
    @NotNull(message = "Loan ID is required")
    private Long loanId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private String method; // BANK_TRANSFER, CARD, CASH, MOBILE_MONEY
    
    private String reference;
}
