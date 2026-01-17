package com.microfinancemanager.microfinancemanager.controller;

import com.microfinancemanager.microfinancemanager.dto.common.ApiResponse;
import com.microfinancemanager.microfinancemanager.dto.notification.CreateNotificationRequest;
import com.microfinancemanager.microfinancemanager.dto.notification.NotificationResponse;
import com.microfinancemanager.microfinancemanager.model.Notification;
import com.microfinancemanager.microfinancemanager.service.NotificationService;
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
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Notifications", description = "User notification management")
@SecurityRequirement(name = "Bearer Authentication")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        
        Notification.NotificationStatus notificationStatus = status != null ? 
                Notification.NotificationStatus.valueOf(status) : null;
        Notification.NotificationType notificationType = type != null ? 
                Notification.NotificationType.valueOf(type) : null;
        
        List<NotificationResponse> notifications = notificationService.getUserNotifications(
                userId, notificationStatus, notificationType);
        
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {
        NotificationResponse notification = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    @PutMapping("/{notificationId}")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long notificationId) {
        NotificationResponse response = notificationService.markAsRead(notificationId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("notificationId", response.getNotificationId());
        data.put("status", response.getStatus());
        
        return ResponseEntity.ok(new ApiResponse("Notification marked as read", data));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        
        Map<String, Object> data = new HashMap<>();
        data.put("notificationId", notificationId);
        
        return ResponseEntity.ok(new ApiResponse("Notification deleted successfully", data));
    }
}
