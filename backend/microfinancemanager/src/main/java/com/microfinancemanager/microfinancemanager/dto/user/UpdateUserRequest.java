package com.microfinancemanager.microfinancemanager.dto.user;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
}
