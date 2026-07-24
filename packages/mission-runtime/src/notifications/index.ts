export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  actor?: string;
}

export interface NotificationProvider {
  send(notification: Omit<Notification, "id" | "read" | "createdAt">): Promise<Notification>;
  list(limit?: number): Promise<Notification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  countUnread(): Promise<number>;
}

export class NotificationService implements NotificationProvider {
  private notifications: Notification[] = [];
  private maxEntries: number;

  constructor(maxEntries = 500) {
    this.maxEntries = maxEntries;
  }

  async send(n: Omit<Notification, "id" | "read" | "createdAt">): Promise<Notification> {
    const notification: Notification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notification);
    if (this.notifications.length > this.maxEntries) {
      this.notifications = this.notifications.slice(0, this.maxEntries);
    }
    return notification;
  }

  async list(limit = 50): Promise<Notification[]> {
    return this.notifications.slice(0, limit);
  }

  async markRead(id: string): Promise<void> {
    const n = this.notifications.find(n => n.id === id);
    if (n) n.read = true;
  }

  async markAllRead(): Promise<void> {
    for (const n of this.notifications) {
      n.read = true;
    }
  }

  async countUnread(): Promise<number> {
    return this.notifications.filter(n => !n.read).length;
  }
}
