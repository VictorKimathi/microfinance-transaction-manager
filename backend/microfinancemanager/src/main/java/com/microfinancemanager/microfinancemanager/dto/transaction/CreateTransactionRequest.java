package com.microfinancemanager.microfinancemanager.dto.transaction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {
    
    @NotNull(message = "Account ID is required")
    private Long accountId;
    
    @NotNull(message = "Transaction type is required")
    private String type; // DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    private String description;
}
