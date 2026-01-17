package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.account.AccountResponse;
import com.microfinancemanager.microfinancemanager.dto.account.CreateAccountRequest;
import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.model.Account;
import com.microfinancemanager.microfinancemanager.service.AccountService;
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
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Account Management", description = "Manage user accounts and balances")
@SecurityRequirement(name = "Bearer Authentication")
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getUserAccounts(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        Account.AccountStatus accountStatus = status != null ? Account.AccountStatus.valueOf(status) : null;
        List<AccountResponse> accounts = accountService.getUserAccounts(userId, accountStatus);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long accountId) {
        AccountResponse account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse account = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(account);
    }

    @PutMapping("/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateAccount(
            @PathVariable Long accountId,
            @RequestBody Map<String, String> request) {
        Account.AccountStatus status = Account.AccountStatus.valueOf(request.get("status"));
        AccountResponse response = accountService.updateAccountStatus(accountId, status);
        Map<String, Object> data = new HashMap<>();
        data.put("accountId", response.getAccountId());
        data.put("status", response.getStatus());
        return ResponseEntity.ok(new ApiResponse("Account updated successfully", data));
    }

    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> closeAccount(@PathVariable Long accountId) {
        accountService.closeAccount(accountId);
        Map<String, Object> data = new HashMap<>();
        data.put("accountId", accountId);
        data.put("status", "CLOSED");
        return ResponseEntity.ok(new ApiResponse("Account closed successfully", data));
    }
}
