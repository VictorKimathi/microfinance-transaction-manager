package com.microfinancemanager.microfinancemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @lombok.Builder.Default
    private NotificationStatus status = NotificationStatus.UNREAD;

    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "sent_at")
    @CreationTimestamp
    private LocalDateTime sentAt;

    public enum NotificationType {
        INFO, WARNING, ALERT, PROMOTION, ACCOUNT_APPROVED, LOAN_APPROVED, 
        LOAN_REJECTED, PAYMENT_RECEIVED, PAYMENT_DUE, CUSTOM
    }

    public enum NotificationStatus {
        UNREAD, READ, ARCHIVED
    }
}
