/**
 * @bhavya/notifications — Notification Manager
 *
 * Manages notification preferences, routing, and delivery across channels.
 */

import { generateId } from "@bhavya/platform";
import type {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationPreference,
} from "@bhavya/types";
import type { NotificationChannelHandler, ChannelResult } from "./channels.js";

/**
 * Notification manager that routes notifications to channels.
 */
export class NotificationManager {
  private channels = new Map<NotificationChannel, NotificationChannelHandler>();
  private preferences: NotificationPreference[] = [];
  private history: Notification[] = [];

  /**
   * Register a notification channel handler.
   */
  registerChannel(handler: NotificationChannelHandler) {
    this.channels.set(handler.channel, handler);
  }

  /**
   * Set user notification preferences.
   */
  setPreference(
    userId: string,
    channel: NotificationChannel,
    type: NotificationType,
    enabled: boolean,
  ) {
    const idx = this.preferences.findIndex(
      (p) => p.userId === userId && p.channel === channel && p.types.includes(type),
    );
    if (idx >= 0) {
      this.preferences[idx].enabled = enabled;
    } else {
      this.preferences.push({ userId, channel, types: [type], enabled });
    }
  }

  /**
   * Send a notification through all enabled channels.
   */
  async send(params: {
    type: NotificationType;
    recipient: string;
    subject: string;
    body: string;
    channels?: NotificationChannel[];
    data?: Record<string, unknown>;
  }): Promise<{ results: Map<NotificationChannel, ChannelResult> }> {
    const channels = params.channels || ["in-app", "email"];
    const results = new Map<NotificationChannel, ChannelResult>();

    for (const channel of channels) {
      if (!this.isChannelEnabled(params.recipient, channel, params.type))
        continue;

      const handler = this.channels.get(channel);
      if (!handler) continue;

      const notification: Notification = {
        id: generateId("notif"),
        type: params.type,
        channel,
        recipient: params.recipient,
        title: params.subject,
        body: params.body,
        metadata: params.data ?? {},
        status: "pending",
        createdAt: new Date(),
      };

      try {
        const result = await handler.send(notification);
        results.set(channel, result);
        notification.status = result.success ? "sent" : "failed";
        if (result.success) notification.sentAt = new Date();
      } catch (err: unknown) {
        results.set(channel, { success: false, error: err instanceof Error ? err.message : String(err) });
        notification.status = "failed";
      }

      this.history.push(notification);
    }

    return { results };
  }

  /**
   * Get notification history for a user.
   */
  getHistory(userId: string, limit = 50): Notification[] {
    return this.history.filter((n) => n.recipient === userId).slice(-limit);
  }

  private isChannelEnabled(
    userId: string,
    channel: NotificationChannel,
    type: NotificationType,
  ): boolean {
    const pref = this.preferences.find(
      (p) => p.userId === userId && p.channel === channel && p.types.includes(type),
    );
    return pref?.enabled ?? true;
  }
}
