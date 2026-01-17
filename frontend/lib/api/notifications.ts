// ============================================
// Notification Management API Service
// ============================================

import { api } from "./client";
import {
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const notificationApi = {
  /**
   * Get all notifications for a user
   * GET /notifications/user/{userId}
   */
  getUserNotifications: async (
    userId: number,
    params?: NotificationQueryParams
  ): Promise<Notification[]> => {
    return api.get<Notification[]>(`/notifications/user/${userId}`, params);
  },

  /**
   * Get single notification details
   * GET /notifications/{notificationId}
   */
  getNotification: async (notificationId: number): Promise<Notification> => {
    return api.get<Notification>(`/notifications/${notificationId}`);
  },

  /**
   * Create/send notification (Admin only)
   * POST /notifications
   */
  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<Notification> => {
    return api.post<Notification>("/notifications", data);
  },

  /**
   * Mark notification as read
   * PUT /notifications/{notificationId}
   */
  markAsRead: async (notificationId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/notifications/${notificationId}`, {
      status: "READ",
    });
  },

  /**
   * Mark notification as unread
   * PUT /notifications/{notificationId}
   */
  markAsUnread: async (notificationId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/notifications/${notificationId}`, {
      status: "UNREAD",
    });
  },

  /**
   * Archive notification
   * PUT /notifications/{notificationId}
   */
  archiveNotification: async (
    notificationId: number
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/notifications/${notificationId}`, {
      status: "ARCHIVED",
    });
  },

  /**
   * Delete notification
   * DELETE /notifications/{notificationId}
   */
  deleteNotification: async (
    notificationId: number
  ): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/notifications/${notificationId}`);
  },

  /**
   * Get unread notifications
   * GET /notifications/user/{userId}?status=UNREAD
   */
  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    return api.get<Notification[]>(`/notifications/user/${userId}`, {
      status: "UNREAD",
    });
  },

  /**
   * Get read notifications
   * GET /notifications/user/{userId}?status=READ
   */
  getReadNotifications: async (userId: number): Promise<Notification[]> => {
    return api.get<Notification[]>(`/notifications/user/${userId}`, {
      status: "READ",
    });
  },

  /**
   * Get notifications by type
   * GET /notifications/user/{userId}?type={type}
   */
  getNotificationsByType: async (
    userId: number,
    type: "ACCOUNT_APPROVED" | "LOAN_APPROVED" | "LOAN_REJECTED" | "PAYMENT_RECEIVED" | "CUSTOM"
  ): Promise<Notification[]> => {
    return api.get<Notification[]>(`/notifications/user/${userId}`, {
      type,
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead: async (userId: number): Promise<void> => {
    const unreadNotifications = await api.get<Notification[]>(
      `/notifications/user/${userId}`,
      { status: "UNREAD" }
    );

    await Promise.all(
      unreadNotifications.map((notification) =>
        api.put(`/notifications/${notification.notificationId}`, {
          status: "READ",
        })
      )
    );
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (userId: number): Promise<number> => {
    const unreadNotifications = await api.get<Notification[]>(
      `/notifications/user/${userId}`,
      { status: "UNREAD" }
    );
    return unreadNotifications.length;
  },

  /**
   * Delete all read notifications
   */
  deleteAllRead: async (userId: number): Promise<void> => {
    const readNotifications = await api.get<Notification[]>(
      `/notifications/user/${userId}`,
      { status: "READ" }
    );

    await Promise.all(
      readNotifications.map((notification) =>
        api.delete(`/notifications/${notification.notificationId}`)
      )
    );
  },

  /**
   * Send custom notification (Admin only)
   */
  sendCustomNotification: async (
    userId: number,
    message: string
  ): Promise<Notification> => {
    return api.post<Notification>("/notifications", {
      userId,
      type: "CUSTOM",
      message,
      relatedId: null,
    });
  },
};
