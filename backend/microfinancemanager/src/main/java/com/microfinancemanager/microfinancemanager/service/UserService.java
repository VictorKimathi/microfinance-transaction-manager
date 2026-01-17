package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.user.CreateUserRequest;
import com.microfinancemanager.microfinancemanager.dto.user.UpdateUserRequest;
import com.microfinancemanager.microfinancemanager.dto.user.UserResponse;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .status(request.getStatus() != null ? request.getStatus() : User.UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);
        
        log.info("User created successfully with ID: {}", user.getUserId());
        
        // Send notification
        notificationService.sendNotification(
                user.getUserId(),
                "ACCOUNT_CREATED",
                "Your account has been created successfully. Welcome to Microfinance Transaction Manager!",
                user.getUserId()
        );

        return mapToUserResponse(user);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public Page<UserResponse> getAllUsers(User.UserStatus status, User.UserRole role, String search, Pageable pageable) {
        log.info("UserService.getAllUsers called with: status={}, role={}, search={}, page={}, size={}",
                status, role, search, pageable.getPageNumber(), pageable.getPageSize());
        
        Page<UserResponse> result = userRepository.findAllWithFilters(status, role, search, pageable)
                .map(this::mapToUserResponse);
        
        log.info("UserService.getAllUsers returning {} users out of {} total", 
                result.getNumberOfElements(), result.getTotalElements());
        
        return result;
    }

    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.UserStatus.ACTIVE);
        user = userRepository.save(user);

        // Send notification
        notificationService.sendNotification(
                userId,
                "ACCOUNT_APPROVED",
                "Your account has been approved and is now active",
                userId
        );

        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse suspendUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(User.UserStatus.INACTIVE);
        user = userRepository.save(user);

        // Send notification
        notificationService.sendNotification(
                userId,
                "WARNING",
                "Your account has been suspended. Reason: " + reason,
                userId
        );

        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.INACTIVE);
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus().name())
                .role(user.getRole().name())
                .registrationDate(user.getRegistrationDate())
                .build();
    }
}
