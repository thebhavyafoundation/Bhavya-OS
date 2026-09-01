/**
 * @bhavya/events — Event Bus
 *
 * In-process publish/subscribe event bus with history, retry, and metrics.
 */

import { generateId } from "@bhavya/platform";
import type {
  BhavyaEvent,
  EventHandler,
  EventSubscription,
  EventFilter,
  EventPriority,
} from "@bhavya/types";

export interface EventBusConfig {
  maxRetries?: number;
  historyLimit?: number;
}

/**
 * In-process event bus with retry, history, and metrics.
 */
export class EventBus {
  private subscriptions = new Map<string, EventSubscription[]>();
  private history: BhavyaEvent[] = [];
  private config: Required<EventBusConfig>;

  constructor(config: EventBusConfig = {}) {
    this.config = {
      maxRetries: 3,
      historyLimit: 1000,
      ...config,
    };
  }

  /**
   * Subscribe to an event type.
   */
  subscribe(
    eventType: string,
    handler: EventHandler,
    priority: EventPriority = "medium",
  ): string {
    const subscription: EventSubscription = {
      id: generateId("sub"),
      eventType,
      handler,
      priority,
      once: false,
      active: true,
      createdAt: new Date(),
    };
    const subs = this.subscriptions.get(eventType) || [];
    subs.push(subscription);
    this.subscriptions.set(eventType, subs);
    return subscription.id;
  }

  /**
   * Unsubscribe from an event type.
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [, subs] of this.subscriptions) {
      const idx = subs.findIndex((s) => s.id === subscriptionId);
      if (idx >= 0) {
        subs.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Publish an event to all subscribers.
   */
  async publish<T = unknown>(
    event: Omit<
      BhavyaEvent<T>,
      "id" | "createdAt" | "retryCount" | "maxRetries" | "status" | "priority"
    >,
  ): Promise<BhavyaEvent<T>> {
    const fullEvent: BhavyaEvent<T> = {
      id: generateId("evt"),
      priority: "medium",
      status: "pending",
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      createdAt: new Date(),
      ...event,
    };

    this.addToHistory(fullEvent as BhavyaEvent);
    const subs = this.subscriptions.get(event.type) || [];

    for (const sub of subs.filter((s) => s.active)) {
      await this.deliverEvent(fullEvent as BhavyaEvent, sub);
    }

    fullEvent.status = "completed";
    fullEvent.processedAt = new Date();
    return fullEvent;
  }

  /**
   * Get event history, optionally filtered.
   */
  getHistory(filter?: EventFilter): BhavyaEvent[] {
    let events = [...this.history];
    if (filter?.types)
      events = events.filter((e) => filter.types!.includes(e.type));
    if (filter?.source)
      events = events.filter((e) => filter.source!.includes(e.source));
    if (filter?.since)
      events = events.filter((e) => e.createdAt >= filter.since!);
    if (filter?.until)
      events = events.filter((e) => e.createdAt <= filter.until!);
    if (filter?.limit) events = events.slice(-filter.limit);
    return events;
  }

  /**
   * Get metrics for the event bus.
   */
  getMetrics() {
    return {
      totalPublished: this.history.length,
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (sum, subs) => sum + subs.length,
        0,
      ),
      eventTypes: [...new Set(this.history.map((e) => e.type))].length,
      failedEvents: this.history.filter((e) => e.status === "failed").length,
    };
  }

  private async deliverEvent(
    event: BhavyaEvent,
    subscription: EventSubscription,
  ): Promise<void> {
    try {
      event.status = "processing";
      await subscription.handler(event);
    } catch (err: unknown) {
      event.error = err instanceof Error ? err.message : String(err);
      if (event.retryCount < event.maxRetries) {
        event.retryCount++;
        event.status = "retrying";
        setTimeout(
          () => this.deliverEvent(event, subscription),
          1000 * event.retryCount,
        );
      } else {
        event.status = "failed";
        event.failedAt = new Date();
      }
    }
  }

  private addToHistory(event: BhavyaEvent): void {
    this.history.push(event);
    if (this.history.length > this.config.historyLimit) {
      this.history = this.history.slice(-this.config.historyLimit);
    }
  }
}
