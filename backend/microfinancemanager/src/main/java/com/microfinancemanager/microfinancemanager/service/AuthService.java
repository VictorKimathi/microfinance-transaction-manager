package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.auth.LoginRequest;
import com.microfinancemanager.microfinancemanager.dto.auth.LoginResponse;
import com.microfinancemanager.microfinancemanager.dto.auth.RegisterRequest;
import com.microfinancemanager.microfinancemanager.dto.user.UserResponse;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.UserRepository;
import com.microfinancemanager.microfinancemanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status(User.UserStatus.PENDING)
                .role(User.UserRole.CUSTOMER)
                .build();

        user = userRepository.save(user);

        // Send notification
        notificationService.sendNotification(
                user.getUserId(),
                "INFO",
                "Your registration is pending approval. You will be notified once approved.",
                user.getUserId()
        );

        return mapToUserResponse(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Account not approved yet");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
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
