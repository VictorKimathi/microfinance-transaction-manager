package com.microfinancemanager.microfinancemanager.dto.loan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveLoanRequest {
    
    @NotNull(message = "Approved amount is required")
    @DecimalMin(value = "0.01", message = "Approved amount must be greater than 0")
    private BigDecimal approvedAmount;
    
    private String approvalNotes;
}
