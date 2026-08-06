/**
 * Bhavya OS — Events Module
 * Event system.
 */

export class Events {
  constructor() {
    this.listeners = new Map();
    this.history = [];
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    this.history.push({
      event,
      data,
      timestamp: new Date().toISOString(),
    });

    const callbacks = this.listeners.get(event) || [];
    for (const callback of callbacks) {
      try {
        callback(data);
      } catch (error) {
        console.error(`Event handler error for ${event}:`, error);
      }
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  getHistory(event) {
    if (!event) return [...this.history];
    return this.history.filter(h => h.event === event);
  }

  clearHistory() {
    this.history = [];
  }
}
