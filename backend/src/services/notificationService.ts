import { Notification } from '../models/Notification';
import logger from '../utils/logger';

export type NotificationType =
  | 'complaint_submitted'
  | 'status_updated'
  | 'case_assigned'
  | 'fir_filed'
  | 'evidence_verified';

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export const notificationService = {
  async createNotification(data: CreateNotificationData): Promise<void> {
    try {
      await Notification.create({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        read: false,
      });
      logger.info('Notification created', { userId: data.user_id, type: data.type });
    } catch (error: any) {
      logger.error('Error creating notification', { error: error.message });
    }
  },

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<any[]> {
    try {
      const query: any = { user_id: userId };
      if (unreadOnly) {
        query.read = false;
      }

      const notifications = await Notification.find(query)
        .sort({ created_at: -1 })
        .limit(50);

      return notifications;
    } catch (error: any) {
      logger.error('Error fetching notifications', { error: error.message });
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await Notification.findByIdAndUpdate(notificationId, { read: true });
    } catch (error: any) {
      logger.error('Error marking notification as read', { error: error.message });
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany({ user_id: userId, read: false }, { read: true });
    } catch (error: any) {
      logger.error('Error marking all notifications as read', { error: error.message });
    }
  },
};

