package com.microfinancemanager.microfinancemanager.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String status;
    private String role;
    private LocalDateTime registrationDate;
}
