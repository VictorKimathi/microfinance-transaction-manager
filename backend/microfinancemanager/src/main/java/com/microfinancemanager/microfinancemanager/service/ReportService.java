package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.report.DashboardResponse;
import com.microfinancemanager.microfinancemanager.model.Account;
import com.microfinancemanager.microfinancemanager.model.Loan;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final LoanRepository loanRepository;
    private final RepaymentRepository repaymentRepository;

    public DashboardResponse getAdminDashboard() {
        // User statistics
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByStatus(User.UserStatus.ACTIVE).size();

        // Account statistics
        long totalAccounts = accountRepository.count();
        BigDecimal totalBalance = accountRepository.findAll().stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Transaction statistics
        long totalTransactions = transactionRepository.count();
        BigDecimal totalTransactionAmount = transactionRepository.findAll().stream()
                .map(transaction -> transaction.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Loan statistics
        long totalLoans = loanRepository.count();
        long activeLoans = loanRepository.findByStatus(Loan.LoanStatus.ACTIVE).size();
        long pendingLoans = loanRepository.findByStatus(Loan.LoanStatus.PENDING).size();
        
        BigDecimal totalLoanAmount = loanRepository.findAll().stream()
                .map(Loan::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalOutstandingBalance = loanRepository.findAll().stream()
                .filter(loan -> loan.getStatus() == Loan.LoanStatus.ACTIVE)
                .map(Loan::getPrincipalBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Repayment statistics
        long totalRepayments = repaymentRepository.count();
        BigDecimal totalRepaymentAmount = repaymentRepository.findAll().stream()
                .map(repayment -> repayment.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalAccounts(totalAccounts)
                .totalBalance(totalBalance)
                .totalTransactions(totalTransactions)
                .totalTransactionAmount(totalTransactionAmount)
                .totalLoans(totalLoans)
                .activeLoans(activeLoans)
                .totalLoanAmount(totalLoanAmount)
                .totalOutstandingBalance(totalOutstandingBalance)
                .pendingLoanApplications(pendingLoans)
                .totalRepayments(totalRepayments)
                .totalRepaymentAmount(totalRepaymentAmount)
                .build();
    }
}
