package com.microfinancemanager.microfinancemanager.dto.transaction;

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
public class TransactionResponse {
    
    private Long transactionId;
    private Long accountId;
    private String type;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String description;
    private String status;
    private String referenceNumber;
}
