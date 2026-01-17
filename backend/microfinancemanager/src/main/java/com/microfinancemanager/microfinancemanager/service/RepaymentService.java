package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.repayment.CreateRepaymentRequest;
import com.microfinancemanager.microfinancemanager.dto.repayment.RepaymentResponse;
import com.microfinancemanager.microfinancemanager.model.Loan;
import com.microfinancemanager.microfinancemanager.model.Repayment;
import com.microfinancemanager.microfinancemanager.repository.LoanRepository;
import com.microfinancemanager.microfinancemanager.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final RepaymentRepository repaymentRepository;
    private final LoanRepository loanRepository;
    private final NotificationService notificationService;

    public Page<RepaymentResponse> getLoanRepayments(Long loanId, Pageable pageable) {
        return repaymentRepository.findByLoan_LoanId(loanId, pageable)
                .map(this::mapToRepaymentResponse);
    }

    public RepaymentResponse getRepaymentById(Long repaymentId) {
        Repayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));
        return mapToRepaymentResponse(repayment);
    }

    @Transactional
    public RepaymentResponse createRepayment(CreateRepaymentRequest request) {
        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.ACTIVE) {
            throw new RuntimeException("Loan is not active");
        }

        if (request.getAmount().compareTo(loan.getPrincipalBalance()) > 0) {
            throw new RuntimeException("Repayment amount exceeds remaining balance");
        }

        Repayment repayment = Repayment.builder()
                .loan(loan)
                .amount(request.getAmount())
                .method(Repayment.PaymentMethod.valueOf(request.getMethod()))
                .reference(request.getReference())
                .status(Repayment.RepaymentStatus.SUCCESSFUL)
                .receiptNumber(generateReceiptNumber())
                .build();

        repayment = repaymentRepository.save(repayment);

        // Update loan balance
        loan.setPrincipalBalance(loan.getPrincipalBalance().subtract(request.getAmount()));
        loan.setTotalRepaid(loan.getTotalRepaid().add(request.getAmount()));

        if (loan.getPrincipalBalance().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(Loan.LoanStatus.PAID_OFF);
        }

        loanRepository.save(loan);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "PAYMENT_RECEIVED",
                "Loan repayment of " + request.getAmount() + " received successfully",
                repayment.getRepaymentId()
        );

        return mapToRepaymentResponse(repayment);
    }

    @Transactional
    public RepaymentResponse updateRepaymentStatus(Long repaymentId, Repayment.RepaymentStatus status) {
        Repayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));

        repayment.setStatus(status);
        repayment = repaymentRepository.save(repayment);

        return mapToRepaymentResponse(repayment);
    }

    @Transactional
    public void reverseRepayment(Long repaymentId) {
        Repayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));

        Loan loan = repayment.getLoan();

        // Restore loan balance
        loan.setPrincipalBalance(loan.getPrincipalBalance().add(repayment.getAmount()));
        loan.setTotalRepaid(loan.getTotalRepaid().subtract(repayment.getAmount()));
        loanRepository.save(loan);

        repayment.setStatus(Repayment.RepaymentStatus.FAILED);
        repaymentRepository.save(repayment);

        // Send notification
        notificationService.sendNotification(
                loan.getUser().getUserId(),
                "INFO",
                "Repayment reversed: " + repayment.getReceiptNumber(),
                repaymentId
        );
    }

    private String generateReceiptNumber() {
        return "RCP" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private RepaymentResponse mapToRepaymentResponse(Repayment repayment) {
        return RepaymentResponse.builder()
                .repaymentId(repayment.getRepaymentId())
                .loanId(repayment.getLoan().getLoanId())
                .amount(repayment.getAmount())
                .timestamp(repayment.getTimestamp())
                .method(repayment.getMethod().name())
                .reference(repayment.getReference())
                .status(repayment.getStatus().name())
                .receiptNumber(repayment.getReceiptNumber())
                .remainingBalance(repayment.getLoan().getPrincipalBalance())
                .build();
    }
}
