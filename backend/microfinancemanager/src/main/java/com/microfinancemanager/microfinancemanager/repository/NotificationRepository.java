package com.microfinancemanager.microfinancemanager.repository;

import com.microfinancemanager.microfinancemanager.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser_UserId(Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.userId = :userId AND " +
           "(:status IS NULL OR n.status = :status) AND " +
           "(:type IS NULL OR n.type = :type) " +
           "ORDER BY n.sentAt DESC")
    List<Notification> findByUserWithFilters(
        @Param("userId") Long userId,
        @Param("status") Notification.NotificationStatus status,
        @Param("type") Notification.NotificationType type
    );
    
    long countByUser_UserIdAndStatus(Long userId, Notification.NotificationStatus status);
}
