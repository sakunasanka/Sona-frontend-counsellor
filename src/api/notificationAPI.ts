import { apiClient } from './apiBase';

// Notification types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  MESSAGE = 'message'
}

// Notification interface matching backend response
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    total: number;
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface NotificationAPIResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

class NotificationAPI {
  /**
   * Get all user notifications
   */
  async getUserNotifications(): Promise<NotificationsResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.get<NotificationsResponse>(
      '/notifications',
      undefined,
      token || undefined,
      true
    );
    return response.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.get<UnreadCountResponse>(
      '/notifications/unread-count',
      undefined,
      token || undefined,
      true
    );
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<NotificationAPIResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.put<NotificationAPIResponse>(
      `/notifications/${notificationId}/read`,
      {},
      token || undefined,
      true
    );
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<NotificationAPIResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.put<NotificationAPIResponse>(
      '/notifications/mark-all-read',
      {},
      token || undefined,
      true
    );
    return response.data;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<NotificationAPIResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.delete<NotificationAPIResponse>(
      `/notifications/${notificationId}`,
      token || undefined,
      true
    );
    return response.data;
  }

  /**
   * Send a notification (admin only)
   */
  async sendNotification(payload: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    relatedURL?: string;
  }): Promise<NotificationAPIResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.post<NotificationAPIResponse>(
      '/notifications/send',
      payload,
      token || undefined,
      true
    );
    return response.data;
  }
}

export const notificationAPI = new NotificationAPI();
export default notificationAPI;
