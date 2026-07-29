// Bhavya Kernel — Event Bus Module
// Publish/subscribe system.

import type { Event, EventHandler } from '../types/index.js';

export class EventBus {
  private handlers = new Map<string, EventHandler[]>();
  private history: Event[] = [];

  async initialize(): Promise<void> {
    // Event bus ready
  }

  async emit(type: string, payload: Record<string, unknown>, source = 'kernel'): Promise<void> {
    const event: Event = {
      id: crypto.randomUUID(),
      type,
      source,
      payload,
      timestamp: new Date(),
      metadata: {},
    };

    this.history.push(event);

    const handlers = this.handlers.get(type) ?? [];
    const wildcardHandlers = this.handlers.get('*') ?? [];

    await Promise.allSettled([
      ...handlers.map((h) => h(event)),
      ...wildcardHandlers.map((h) => h(event)),
    ]);
  }

  on(type: string, handler: EventHandler): () => void {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(handler);
    this.handlers.set(type, handlers);

    return () => {
      const current = this.handlers.get(type) ?? [];
      const index = current.indexOf(handler);
      if (index > -1) current.splice(index, 1);
    };
  }

  once(type: string, handler: EventHandler): () => void {
    const wrapper: EventHandler = async (event) => {
      unsub();
      await handler(event);
    };
    const unsub = this.on(type, wrapper);
    return unsub;
  }

  getHistory(type?: string): Event[] {
    if (type) return this.history.filter((e) => e.type === type);
    return [...this.history];
  }

  async shutdown(): Promise<void> {
    this.handlers.clear();
    this.history = [];
  }
}
