package com.microfinancemanager.microfinancemanager.dto.account;

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
public class AccountResponse {
    
    private Long accountId;
    private Long userId;
    private BigDecimal balance;
    private String accountType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastTransactionDate;
}
