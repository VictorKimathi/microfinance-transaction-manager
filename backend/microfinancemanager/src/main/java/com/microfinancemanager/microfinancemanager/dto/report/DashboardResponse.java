package com.microfinancemanager.microfinancemanager.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalAccounts;
    private BigDecimal totalBalance;
    private Long totalTransactions;
    private BigDecimal totalTransactionAmount;
    private Long totalLoans;
    private Long activeLoans;
    private BigDecimal totalLoanAmount;
    private BigDecimal totalOutstandingBalance;
    private Long pendingLoanApplications;
    private Long totalRepayments;
    private BigDecimal totalRepaymentAmount;
}
