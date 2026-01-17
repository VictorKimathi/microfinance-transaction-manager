package com.microfinancemanager.microfinancemanager.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    
    private Long notificationId;
    private Long userId;
    private String type;
    private String message;
    private String status;
    private Long relatedId;
    private LocalDateTime sentAt;
}
