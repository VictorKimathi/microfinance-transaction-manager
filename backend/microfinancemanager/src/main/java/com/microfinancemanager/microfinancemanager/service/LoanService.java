package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.loan.ApproveLoanRequest;
import com.microfinancemanager.microfinancemanager.dto.loan.CreateLoanRequest;
import com.microfinancemanager.microfinancemanager.dto.loan.LoanResponse;
import com.microfinancemanager.microfinancemanager.model.Account;
import com.microfinancemanager.microfinancemanager.model.Loan;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.AccountRepository;
import com.microfinancemanager.microfinancemanager.repository.LoanRepository;
import com.microfinancemanager.microfinancemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final NotificationService notificationService;

    public List<LoanResponse> getAllLoans(Loan.LoanStatus status) {
        List<Loan> loans;
        if (status != null) {
            loans = loanRepository.findByStatus(status);
        } else {
            loans = loanRepository.findAll();
        }
        return loans.stream().map(this::mapToLoanResponse).collect(Collectors.toList());
    }

    public List<LoanResponse> getUserLoans(Long userId, Loan.LoanStatus status) {
        List<Loan> loans;
        if (status != null) {
            loans = loanRepository.findByUser_UserIdAndStatus(userId, status);
        } else {
            loans = loanRepository.findByUser_UserId(userId);
        }
        return loans.stream().map(this::mapToLoanResponse).collect(Collectors.toList());
    }

    public LoanResponse getLoanById(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return mapToLoanResponse(loan);
    }

    @Transactional
    public LoanResponse createLoan(CreateLoanRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("User not approved");
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Loan loan = Loan.builder()
                .user(user)
                .account(account)
                .amount(request.getAmount())
                .interestRate(request.getInterestRate())
                .repaymentPeriodMonths(request.getRepaymentPeriodMonths())
                .status(Loan.LoanStatus.PENDING)
                .principalBalance(request.getAmount())
                .totalRepaid(BigDecimal.ZERO)
                .build();

        loan = loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                user.getUserId(),
                "INFO",
                "Loan request for " + request.getAmount() + " submitted successfully",
                loan.getLoanId()
        );

        return mapToLoanResponse(loan);
    }

    @Transactional
    public LoanResponse approveLoan(Long loanId, ApproveLoanRequest request) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setAmount(request.getApprovedAmount());
        loan.setPrincipalBalance(request.getApprovedAmount());
        loan.setStartDate(LocalDateTime.now());
        loan.setDueDate(LocalDate.now().plusMonths(loan.getRepaymentPeriodMonths()));

        loan = loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "LOAN_APPROVED",
                "Your loan request for " + request.getApprovedAmount() + " has been approved",
                loanId
        );

        return mapToLoanResponse(loan);
    }

    @Transactional
    public LoanResponse rejectLoan(Long loanId, String rejectionReason) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(Loan.LoanStatus.REJECTED);
        loan = loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "LOAN_REJECTED",
                "Your loan request has been rejected. Reason: " + rejectionReason,
                loanId
        );

        return mapToLoanResponse(loan);
    }

    @Transactional
    public LoanResponse disburseLoan(Long loanId, Long accountId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.APPROVED) {
            throw new RuntimeException("Loan must be approved before disbursement");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(loan.getAmount()));
        accountRepository.save(account);

        loan.setStatus(Loan.LoanStatus.ACTIVE);
        loan = loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "INFO",
                "Loan amount " + loan.getAmount() + " has been disbursed to your account",
                loanId
        );

        return mapToLoanResponse(loan);
    }

    @Transactional
    public void closeLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getPrincipalBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Loan must be fully repaid before closing");
        }

        loan.setStatus(Loan.LoanStatus.PAID_OFF);
        loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "INFO",
                "Congratulations! Your loan has been fully repaid and closed",
                loanId
        );
    }

    private LoanResponse mapToLoanResponse(Loan loan) {
        return LoanResponse.builder()
                .loanId(loan.getLoanId())
                .userId(loan.getUser().getUserId())
                .accountId(loan.getAccount().getAccountId())
                .amount(loan.getAmount())
                .interestRate(loan.getInterestRate())
                .repaymentPeriodMonths(loan.getRepaymentPeriodMonths())
                .status(loan.getStatus().name())
                .requestDate(loan.getRequestDate())
                .startDate(loan.getStartDate())
                .dueDate(loan.getDueDate())
                .principalBalance(loan.getPrincipalBalance())
                .totalRepaid(loan.getTotalRepaid())
                .build();
    }
}
