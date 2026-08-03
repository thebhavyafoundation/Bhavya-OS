/**
 * @bhavya/notifications — Channel Interfaces
 *
 * Abstract interfaces for notification channels.
 */

import type { NotificationChannel, Notification } from "@bhavya/types";

export interface NotificationChannelHandler {
  channel: NotificationChannel;
  send(notification: Notification): Promise<ChannelResult>;
  health?(): Promise<{ status: string; latencyMs: number }>;
}

export interface ChannelResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Console notification channel (for development).
 */
export class ConsoleChannel implements NotificationChannelHandler {
  channel: NotificationChannel = "in-app";

  async send(notification: Notification): Promise<ChannelResult> {
    console.log(
      `[NOTIFICATION] ${notification.type}: ${notification.subject} → ${notification.recipient}`,
    );
    return { success: true };
  }
}

/**
 * In-app notification channel (stores notifications for retrieval).
 */
export class InAppChannel implements NotificationChannelHandler {
  channel: NotificationChannel = "in-app";
  private notifications: Notification[] = [];

  async send(notification: Notification): Promise<ChannelResult> {
    this.notifications.push(notification);
    return { success: true };
  }

  getNotifications(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean },
  ): Notification[] {
    let filtered = this.notifications.filter((n) => n.recipient === userId);
    if (options?.unreadOnly) filtered = filtered.filter((n) => !n.readAt);
    if (options?.limit) filtered = filtered.slice(-options.limit);
    return filtered;
  }

  markRead(notificationId: string): boolean {
    const n = this.notifications.find((n) => n.id === notificationId);
    if (!n) return false;
    n.readAt = new Date().toISOString();
    return true;
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter((n) => n.recipient === userId && !n.readAt)
      .length;
  }
}
