package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.dto.transaction.CreateTransactionRequest;
import com.microfinancemanager.microfinancemanager.dto.transaction.TransactionResponse;
import com.microfinancemanager.microfinancemanager.model.Transaction;
import com.microfinancemanager.microfinancemanager.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Transactions", description = "Financial transaction operations (deposits, withdrawals, transfers)")
@SecurityRequirement(name = "Bearer Authentication")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/account/{accountId}")
    public ResponseEntity<Page<TransactionResponse>> getAccountTransactions(
            @PathVariable Long accountId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        Pageable pageable = PageRequest.of(page, limit);
        Transaction.TransactionType transactionType = type != null ? Transaction.TransactionType.valueOf(type) : null;
        
        Page<TransactionResponse> transactions = transactionService.getAccountTransactions(
                accountId, transactionType, startDate, endDate, pageable);
        
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<TransactionResponse>> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        Pageable pageable = PageRequest.of(page, limit);
        Transaction.TransactionType transactionType = type != null ? Transaction.TransactionType.valueOf(type) : null;
        
        Page<TransactionResponse> transactions = transactionService.getUserTransactions(
                userId, transactionType, startDate, endDate, pageable);
        
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long transactionId) {
        TransactionResponse transaction = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse transaction = transactionService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    @PutMapping("/{transactionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateTransaction(
            @PathVariable Long transactionId,
            @RequestBody Map<String, String> request) {
        Transaction.TransactionStatus status = Transaction.TransactionStatus.valueOf(request.get("status"));
        TransactionResponse response = transactionService.updateTransactionStatus(transactionId, status);
        Map<String, Object> data = new HashMap<>();
        data.put("transactionId", response.getTransactionId());
        data.put("status", response.getStatus());
        return ResponseEntity.ok(new ApiResponse("Transaction updated successfully", data));
    }

    @DeleteMapping("/{transactionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> reverseTransaction(@PathVariable Long transactionId) {
        TransactionResponse transaction = transactionService.getTransactionById(transactionId);
        transactionService.reverseTransaction(transactionId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("transactionId", transactionId);
        data.put("originalAmount", transaction.getAmount());
        data.put("refundedAmount", transaction.getAmount());
        
        return ResponseEntity.ok(new ApiResponse("Transaction reversed successfully", data));
    }
}
