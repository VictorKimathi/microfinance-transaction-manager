package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.transaction.CreateTransactionRequest;
import com.microfinancemanager.microfinancemanager.dto.transaction.TransactionResponse;
import com.microfinancemanager.microfinancemanager.model.Account;
import com.microfinancemanager.microfinancemanager.model.Transaction;
import com.microfinancemanager.microfinancemanager.repository.AccountRepository;
import com.microfinancemanager.microfinancemanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final NotificationService notificationService;

    public Page<TransactionResponse> getAccountTransactions(Long accountId, 
            Transaction.TransactionType type, LocalDateTime startDate, 
            LocalDateTime endDate, Pageable pageable) {
        return transactionRepository.findByAccountWithFilters(accountId, type, startDate, endDate, pageable)
                .map(this::mapToTransactionResponse);
    }

    public Page<TransactionResponse> getUserTransactions(Long userId,
            Transaction.TransactionType type, LocalDateTime startDate,
            LocalDateTime endDate, Pageable pageable) {
        return transactionRepository.findByUserWithFilters(userId, type, startDate, endDate, pageable)
                .map(this::mapToTransactionResponse);
    }

    public TransactionResponse getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return mapToTransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        Transaction.TransactionType type = Transaction.TransactionType.valueOf(request.getType());

        // Check balance for withdrawals
        if (type == Transaction.TransactionType.WITHDRAWAL || 
            type == Transaction.TransactionType.PAYMENT || 
            type == Transaction.TransactionType.TRANSFER) {
            if (account.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            account.setBalance(account.getBalance().subtract(request.getAmount()));
        } else if (type == Transaction.TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance().add(request.getAmount()));
        }

        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .account(account)
                .type(type)
                .amount(request.getAmount())
                .description(request.getDescription())
                .status(Transaction.TransactionStatus.COMPLETED)
                .referenceNumber(generateReferenceNumber())
                .build();

        transaction = transactionRepository.save(transaction);

        // Send notification
        notificationService.sendNotification(
                account.getUser().getUserId(),
                "PAYMENT_RECEIVED",
                "Transaction completed: " + type + " of " + request.getAmount(),
                transaction.getTransactionId()
        );

        return mapToTransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransactionStatus(Long transactionId, Transaction.TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(status);
        transaction = transactionRepository.save(transaction);

        return mapToTransactionResponse(transaction);
    }

    @Transactional
    public void reverseTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getStatus() != Transaction.TransactionStatus.COMPLETED) {
            throw new RuntimeException("Only completed transactions can be reversed");
        }

        Account account = transaction.getAccount();

        // Reverse the transaction amount
        if (transaction.getType() == Transaction.TransactionType.WITHDRAWAL ||
            transaction.getType() == Transaction.TransactionType.PAYMENT ||
            transaction.getType() == Transaction.TransactionType.TRANSFER) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else if (transaction.getType() == Transaction.TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }

        accountRepository.save(account);
        transaction.setStatus(Transaction.TransactionStatus.CANCELLED);
        transactionRepository.save(transaction);

        // Send notification
        notificationService.sendNotification(
                account.getUser().getUserId(),
                "INFO",
                "Transaction reversed: " + transaction.getReferenceNumber(),
                transactionId
        );
    }

    private String generateReferenceNumber() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionId(transaction.getTransactionId())
                .accountId(transaction.getAccount().getAccountId())
                .type(transaction.getType().name())
                .amount(transaction.getAmount())
                .timestamp(transaction.getTimestamp())
                .description(transaction.getDescription())
                .status(transaction.getStatus().name())
                .referenceNumber(transaction.getReferenceNumber())
                .build();
    }
}
