package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.account.AccountResponse;
import com.microfinancemanager.microfinancemanager.dto.account.CreateAccountRequest;
import com.microfinancemanager.microfinancemanager.model.Account;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.AccountRepository;
import com.microfinancemanager.microfinancemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<AccountResponse> getUserAccounts(Long userId, Account.AccountStatus status) {
        List<Account> accounts;
        if (status != null) {
            accounts = accountRepository.findByUser_UserIdAndStatus(userId, status);
        } else {
            accounts = accountRepository.findByUser_UserId(userId);
        }
        return accounts.stream().map(this::mapToAccountResponse).collect(Collectors.toList());
    }

    public AccountResponse getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToAccountResponse(account);
    }

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("User not approved");
        }

        Account account = Account.builder()
                .user(user)
                .accountType(Account.AccountType.valueOf(request.getAccountType()))
                .balance(BigDecimal.ZERO)
                .status(Account.AccountStatus.ACTIVE)
                .build();

        account = accountRepository.save(account);

        // Send notification
        notificationService.sendNotification(
                user.getUserId(),
                "INFO",
                "New " + request.getAccountType() + " account created successfully",
                account.getAccountId()
        );

        return mapToAccountResponse(account);
    }

    @Transactional
    public AccountResponse updateAccountStatus(Long accountId, Account.AccountStatus status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus(status);
        account = accountRepository.save(account);

        return mapToAccountResponse(account);
    }

    @Transactional
    public void closeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new RuntimeException("Account balance must be zero before closing");
        }

        account.setStatus(Account.AccountStatus.CLOSED);
        accountRepository.save(account);

        // Send notification
        notificationService.sendNotification(
                account.getUser().getUserId(),
                "INFO",
                "Account " + accountId + " has been closed",
                accountId
        );
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .userId(account.getUser().getUserId())
                .balance(account.getBalance())
                .accountType(account.getAccountType().name())
                .status(account.getStatus().name())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
