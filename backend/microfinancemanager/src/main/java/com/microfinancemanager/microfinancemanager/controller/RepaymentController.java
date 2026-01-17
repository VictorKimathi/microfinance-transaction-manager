package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.dto.repayment.CreateRepaymentRequest;
import com.microfinancemanager.microfinancemanager.dto.repayment.RepaymentResponse;
import com.microfinancemanager.microfinancemanager.model.Repayment;
import com.microfinancemanager.microfinancemanager.service.RepaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Repayments", description = "Loan repayment tracking and management")
@SecurityRequirement(name = "Bearer Authentication")
public class RepaymentController {

    private final RepaymentService repaymentService;

    @PostMapping
    public ResponseEntity<RepaymentResponse> createRepayment(@Valid @RequestBody CreateRepaymentRequest request) {
        RepaymentResponse repayment = repaymentService.createRepayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(repayment);
    }

    @GetMapping("/loan/{loanId}")
    public ResponseEntity<Page<RepaymentResponse>> getLoanRepayments(
            @PathVariable Long loanId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<RepaymentResponse> repayments = repaymentService.getLoanRepayments(loanId, pageable);
        
        return ResponseEntity.ok(repayments);
    }

    @GetMapping("/{repaymentId}")
    public ResponseEntity<RepaymentResponse> getRepaymentById(@PathVariable Long repaymentId) {
        RepaymentResponse repayment = repaymentService.getRepaymentById(repaymentId);
        return ResponseEntity.ok(repayment);
    }

    @PutMapping("/{repaymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateRepayment(
            @PathVariable Long repaymentId,
            @RequestBody Map<String, String> request) {
        Repayment.RepaymentStatus status = Repayment.RepaymentStatus.valueOf(request.get("status"));
        RepaymentResponse response = repaymentService.updateRepaymentStatus(repaymentId, status);
        
        Map<String, Object> data = new HashMap<>();
        data.put("repaymentId", response.getRepaymentId());
        data.put("status", response.getStatus());
        
        return ResponseEntity.ok(new ApiResponse("Repayment updated successfully", data));
    }

    @DeleteMapping("/{repaymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> reverseRepayment(@PathVariable Long repaymentId) {
        RepaymentResponse repayment = repaymentService.getRepaymentById(repaymentId);
        repaymentService.reverseRepayment(repaymentId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("repaymentId", repaymentId);
        data.put("refundedAmount", repayment.getAmount());
        data.put("loanBalanceRestored", repayment.getAmount());
        
        return ResponseEntity.ok(new ApiResponse("Repayment reversed successfully", data));
    }
}
