package com.microfinancemanager.microfinancemanager.service;

import com.microfinancemanager.microfinancemanager.dto.notification.CreateNotificationRequest;
import com.microfinancemanager.microfinancemanager.dto.notification.NotificationResponse;
import com.microfinancemanager.microfinancemanager.model.Notification;
import com.microfinancemanager.microfinancemanager.model.User;
import com.microfinancemanager.microfinancemanager.repository.NotificationRepository;
import com.microfinancemanager.microfinancemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getUserNotifications(Long userId, 
            Notification.NotificationStatus status, Notification.NotificationType type) {
        return notificationRepository.findByUserWithFilters(userId, status, type)
                .stream()
                .map(this::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse getNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return mapToNotificationResponse(notification);
    }

    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.valueOf(request.getType()))
                .message(request.getMessage())
                .status(Notification.NotificationStatus.UNREAD)
                .relatedId(request.getRelatedId())
                .build();

        notification = notificationRepository.save(notification);
        return mapToNotificationResponse(notification);
    }

    @Transactional
    public void sendNotification(Long userId, String type, String message, Long relatedId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.valueOf(type))
                .message(message)
                .status(Notification.NotificationStatus.UNREAD)
                .relatedId(relatedId)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setStatus(Notification.NotificationStatus.READ);
        notification = notificationRepository.save(notification);

        return mapToNotificationResponse(notification);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndStatus(userId, Notification.NotificationStatus.UNREAD);
    }

    private NotificationResponse mapToNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .userId(notification.getUser().getUserId())
                .type(notification.getType().name())
                .message(notification.getMessage())
                .status(notification.getStatus().name())
                .relatedId(notification.getRelatedId())
                .sentAt(notification.getSentAt())
                .build();
    }
}
