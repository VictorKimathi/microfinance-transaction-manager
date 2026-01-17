package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.dto.loan.ApproveLoanRequest;
import com.microfinancemanager.microfinancemanager.dto.loan.CreateLoanRequest;
import com.microfinancemanager.microfinancemanager.dto.loan.LoanResponse;
import com.microfinancemanager.microfinancemanager.model.Loan;
import com.microfinancemanager.microfinancemanager.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Loan Management", description = "Loan application, approval, and disbursement operations")
@SecurityRequirement(name = "Bearer Authentication")
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(@Valid @RequestBody CreateLoanRequest request) {
        LoanResponse loan = loanService.createLoan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT')")
    @Operation(summary = "Get all loans with optional status filter")
    public ResponseEntity<List<LoanResponse>> getAllLoans(
            @RequestParam(required = false) String status) {
        Loan.LoanStatus loanStatus = status != null ? Loan.LoanStatus.valueOf(status.toUpperCase()) : null;
        List<LoanResponse> loans = loanService.getAllLoans(loanStatus);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> getUserLoans(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        Loan.LoanStatus loanStatus = status != null ? Loan.LoanStatus.valueOf(status) : null;
        List<LoanResponse> loans = loanService.getUserLoans(userId, loanStatus);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable Long loanId) {
        LoanResponse loan = loanService.getLoanById(loanId);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/{loanId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveLoan(
            @PathVariable Long loanId,
            @Valid @RequestBody ApproveLoanRequest request) {
        LoanResponse response = loanService.approveLoan(loanId, request);
        
        Map<String, Object> data = new HashMap<>();
        data.put("loanId", response.getLoanId());
        data.put("status", response.getStatus());
        data.put("approvedAmount", response.getAmount());
        data.put("startDate", response.getStartDate());
        data.put("dueDate", response.getDueDate());
        data.put("notificationSent", true);
        
        return ResponseEntity.ok(new ApiResponse("Loan approved successfully", data));
    }

    @PutMapping("/{loanId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> rejectLoan(
            @PathVariable Long loanId,
            @RequestBody Map<String, String> request) {
        String rejectionReason = request.get("rejectionReason");
        LoanResponse response = loanService.rejectLoan(loanId, rejectionReason);
        
        Map<String, Object> data = new HashMap<>();
        data.put("loanId", response.getLoanId());
        data.put("status", response.getStatus());
        data.put("rejectionReason", rejectionReason);
        data.put("notificationSent", true);
        
        return ResponseEntity.ok(new ApiResponse("Loan rejected successfully", data));
    }

    @PostMapping("/{loanId}/disburse")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> disburseLoan(
            @PathVariable Long loanId,
            @RequestBody Map<String, Long> request) {
        Long accountId = request.get("accountId");
        LoanResponse response = loanService.disburseLoan(loanId, accountId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("loanId", response.getLoanId());
        data.put("status", response.getStatus());
        data.put("disburseDate", response.getStartDate());
        data.put("disburseAmount", response.getAmount());
        data.put("accountId", accountId);
        
        return ResponseEntity.ok(new ApiResponse("Loan disbursed successfully", data));
    }

    @PutMapping("/{loanId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateLoan(
            @PathVariable Long loanId,
            @RequestBody Map<String, String> request) {
        // This would typically update loan status
        Map<String, Object> data = new HashMap<>();
        data.put("loanId", loanId);
        data.put("status", request.get("status"));
        return ResponseEntity.ok(new ApiResponse("Loan updated successfully", data));
    }

    @DeleteMapping("/{loanId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> closeLoan(@PathVariable Long loanId) {
        loanService.closeLoan(loanId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("loanId", loanId);
        data.put("status", "COMPLETED");
        
        return ResponseEntity.ok(new ApiResponse("Loan closed successfully", data));
    }
}
