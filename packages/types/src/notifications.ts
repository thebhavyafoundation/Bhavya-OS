/**
 * @bhavya/types — Notification Types
 *
 * Canonical notification types for the notification platform.
 */

/** A notification */
export interface Notification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  body: string;
  data?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

/** Notification type */
export type NotificationType =
  "info" | "warning" | "error" | "success" | "approval" | "reminder" | "system";

/** Notification channel */
export type NotificationChannel =
  "email" | "in-app" | "slack" | "discord" | "telegram" | "push" | "whatsapp";

/** Notification status */
export type NotificationStatus =
  "pending" | "sent" | "delivered" | "read" | "failed";

/** Notification preference */
export interface NotificationPreference {
  userId: string;
  channel: NotificationChannel;
  type: NotificationType;
  enabled: boolean;
}
