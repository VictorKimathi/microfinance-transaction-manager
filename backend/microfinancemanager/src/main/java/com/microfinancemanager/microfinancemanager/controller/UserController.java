package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.dto.user.CreateUserRequest;
import com.microfinancemanager.microfinancemanager.dto.user.UpdateUserRequest;
import com.microfinancemanager.microfinancemanager.dto.user.UserResponse;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "User Management", description = "CRUD operations for user management")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new user", description = "Admin can create new users with specified role and status")
    public ResponseEntity<ApiResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("POST /api/users - Creating new user with email: {}", request.getEmail());
        UserResponse response = userService.createUser(request);
        log.info("User created successfully with ID: {}", response.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("User created successfully", response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        UserResponse response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        log.info("GET /api/users - Fetching users with params: status={}, role={}, search={}, page={}, limit={}", 
                status, role, search, page, limit);
        
        Pageable pageable = PageRequest.of(page, limit);
        User.UserStatus userStatus = status != null ? User.UserStatus.valueOf(status) : null;
        User.UserRole userRole = role != null ? User.UserRole.valueOf(role) : null;

        Page<UserResponse> users = userService.getAllUsers(userStatus, userRole, search, pageable);
        
        log.info("Found {} users out of {} total users", users.getNumberOfElements(), users.getTotalElements());
        log.debug("User list: {}", users.getContent());

        Map<String, Object> response = new HashMap<>();
        response.put("total", users.getTotalElements());
        response.put("page", page);
        response.put("limit", limit);
        response.put("users", users.getContent());
        
        log.info("Returning response with {} users in 'users' field", users.getContent().size());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user details", description = "Admin can update user name and phone")
    public ResponseEntity<ApiResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("PUT /api/users/{} - Updating user", userId);
        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(new ApiResponse("User profile updated successfully", response));
    }

    @PutMapping("/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveUser(@PathVariable Long userId) {
        UserResponse response = userService.approveUser(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("userId", response.getUserId());
        data.put("status", response.getStatus());
        data.put("notificationSent", true);
        return ResponseEntity.ok(new ApiResponse("User approved successfully", data));
    }

    @PutMapping("/{userId}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> suspendUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        UserResponse response = userService.suspendUser(userId, reason);
        Map<String, Object> data = new HashMap<>();
        data.put("userId", response.getUserId());
        data.put("status", response.getStatus());
        return ResponseEntity.ok(new ApiResponse("User suspended successfully", data));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        return ResponseEntity.ok(new ApiResponse("User deleted successfully", data));
    }
}
