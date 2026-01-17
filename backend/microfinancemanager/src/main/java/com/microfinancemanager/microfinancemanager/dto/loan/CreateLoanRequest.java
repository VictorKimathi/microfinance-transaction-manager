package com.microfinancemanager.microfinancemanager.dto.loan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLoanRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Account ID is required")
    private Long accountId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0", message = "Interest rate must be non-negative")
    private BigDecimal interestRate;
    
    @NotNull(message = "Repayment period is required")
    @Min(value = 1, message = "Repayment period must be at least 1 month")
    private Integer repaymentPeriodMonths;
}
