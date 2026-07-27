/**
 * Event Bus
 *
 * Publish/subscribe system for inter-engine communication. Provides
 * event routing, filtering, persistence, and replay capabilities.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventPriority = "critical" | "high" | "medium" | "low";

export type EventStatus =
  "pending" | "processing" | "completed" | "failed" | "retrying";

export interface Event {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  priority: EventPriority;
  status: EventStatus;
  metadata: Record<string, unknown>;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  filter?: EventFilter;
  priority: number;
  once: boolean;
  createdAt: Date;
}

export interface EventFilter {
  source?: string;
  priority?: EventPriority[];
  payloadFilter?: (payload: Record<string, unknown>) => boolean;
}

export type EventHandler = (event: Event) => Promise<void> | void;

export interface EventBusConfig {
  maxRetries: number;
  retryDelay: number;
  maxQueueSize: number;
  persistenceEnabled: boolean;
  persistencePath?: string;
}

export interface EventBusMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByPriority: Record<EventPriority, number>;
  eventsByStatus: Record<EventStatus, number>;
  avgProcessingTime: number;
  errorRate: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class EventBus {
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventQueue: Event[] = [];
  private processedEvents: Event[] = [];
  private config: EventBusConfig;
  private processing: boolean = false;
  private processors: Map<string, (event: Event) => Promise<void>> = new Map();

  constructor(config: Partial<EventBusConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      maxQueueSize: 10000,
      persistenceEnabled: false,
      ...config,
    };
  }

  // ─── Core Operations ──────────────────────────────────────────────────────

  /**
   * Publish an event
   */
  async publish(
    event: Omit<
      Event,
      "id" | "createdAt" | "status" | "retryCount" | "maxRetries"
    >,
  ): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: this.generateId(),
      status: "pending",
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      createdAt: new Date(),
    };

    // Check queue size
    if (this.eventQueue.length >= this.config.maxQueueSize) {
      throw new Error("Event queue is full");
    }

    this.eventQueue.push(newEvent);

    // Process immediately if not already processing
    if (!this.processing) {
      this.processQueue();
    }

    return newEvent;
  }

  /**
   * Subscribe to an event type
   */
  subscribe(
    eventType: string,
    handler: EventHandler,
    options: { filter?: EventFilter; priority?: number; once?: boolean } = {},
  ): string {
    const subscription: EventSubscription = {
      id: this.generateId(),
      eventType,
      handler,
      filter: options.filter,
      priority: options.priority || 0,
      once: options.once || false,
      createdAt: new Date(),
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const subs = this.subscriptions.get(eventType)!;
    subs.push(subscription);
    subs.sort((a, b) => b.priority - a.priority);

    return subscription.id;
  }

  /**
   * Subscribe to an event type (once)
   */
  subscribeOnce(
    eventType: string,
    handler: EventHandler,
    filter?: EventFilter,
  ): string {
    return this.subscribe(eventType, handler, { filter, once: true });
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [eventType, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex((s) => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscriptions.delete(eventType);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Register a processor for an event type
   */
  registerProcessor(
    eventType: string,
    processor: (event: Event) => Promise<void>,
  ): void {
    this.processors.set(eventType, processor);
  }

  /**
   * Get event by ID
   */
  async getEvent(id: string): Promise<Event | null> {
    // Check queue
    const queued = this.eventQueue.find((e) => e.id === id);
    if (queued) return queued;

    // Check processed
    const processed = this.processedEvents.find((e) => e.id === id);
    if (processed) return processed;

    return null;
  }

  /**
   * Get events by type
   */
  async getEventsByType(type: string, limit: number = 10): Promise<Event[]> {
    return this.processedEvents.filter((e) => e.type === type).slice(0, limit);
  }

  /**
   * Get events by status
   */
  async getEventsByStatus(
    status: EventStatus,
    limit: number = 10,
  ): Promise<Event[]> {
    return this.processedEvents
      .filter((e) => e.status === status)
      .slice(0, limit);
  }

  /**
   * Retry a failed event
   */
  async retry(eventId: string): Promise<boolean> {
    const event = this.processedEvents.find((e) => e.id === eventId);
    if (!event || event.status !== "failed") return false;

    event.status = "pending";
    event.retryCount = 0;
    event.error = undefined;

    this.eventQueue.push(event);
    this.processedEvents = this.processedEvents.filter((e) => e.id !== eventId);

    if (!this.processing) {
      this.processQueue();
    }

    return true;
  }

  /**
   * Clear processed events
   */
  async clearProcessed(): Promise<number> {
    const count = this.processedEvents.length;
    this.processedEvents = [];
    return count;
  }

  /**
   * Get metrics
   */
  async getMetrics(): Promise<EventBusMetrics> {
    const allEvents = [...this.eventQueue, ...this.processedEvents];

    const eventsByType: Record<string, number> = {};
    const eventsByPriority: Record<EventPriority, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    const eventsByStatus: Record<EventStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      retrying: 0,
    };

    let totalProcessingTime = 0;
    let processedCount = 0;
    let errorCount = 0;

    for (const event of allEvents) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsByPriority[event.priority]++;
      eventsByStatus[event.status]++;

      if (event.processedAt) {
        totalProcessingTime +=
          event.processedAt.getTime() - event.createdAt.getTime();
        processedCount++;
      }

      if (event.status === "failed") {
        errorCount++;
      }
    }

    return {
      totalEvents: allEvents.length,
      eventsByType,
      eventsByPriority,
      eventsByStatus,
      avgProcessingTime:
        processedCount > 0 ? totalProcessingTime / processedCount : 0,
      errorRate: allEvents.length > 0 ? errorCount / allEvents.length : 0,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.eventQueue.length === 0) return;

    this.processing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      await this.processEvent(event);
    }

    this.processing = false;
  }

  private async processEvent(event: Event): Promise<void> {
    event.status = "processing";

    // Get subscriptions for this event type
    const subscriptions = this.subscriptions.get(event.type) || [];

    // Get processor
    const processor = this.processors.get(event.type);

    try {
      // Process with processor if registered
      if (processor) {
        await processor(event);
      }

      // Process with subscriptions
      for (const subscription of subscriptions) {
        // Check filter
        if (
          subscription.filter &&
          !this.matchesFilter(event, subscription.filter)
        ) {
          continue;
        }

        await subscription.handler(event);

        // Remove if once
        if (subscription.once) {
          this.unsubscribe(subscription.id);
        }
      }

      event.status = "completed";
      event.processedAt = new Date();
    } catch (error) {
      event.retryCount++;

      if (event.retryCount >= event.maxRetries) {
        event.status = "failed";
        event.failedAt = new Date();
        event.error = error instanceof Error ? error.message : String(error);
      } else {
        event.status = "retrying";
        // Re-queue with delay
        setTimeout(() => {
          this.eventQueue.push(event);
          if (!this.processing) {
            this.processQueue();
          }
        }, this.config.retryDelay * event.retryCount);
      }
    }

    this.processedEvents.push(event);
  }

  private matchesFilter(event: Event, filter: EventFilter): boolean {
    if (filter.source && event.source !== filter.source) {
      return false;
    }

    if (filter.priority && !filter.priority.includes(event.priority)) {
      return false;
    }

    if (filter.payloadFilter && !filter.payloadFilter(event.payload)) {
      return false;
    }

    return true;
  }
}

export default EventBus;
