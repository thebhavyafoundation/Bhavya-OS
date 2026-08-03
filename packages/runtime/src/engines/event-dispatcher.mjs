/**
 * Event Dispatcher — registry-aware event system.
 * Events are defined in BAR and dispatched through this engine.
 */
export class EventDispatcher {
  #registry;
  #handlers = new Map();
  #history = [];
  #maxHistory = 1000;

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Register an event handler.
   * @param {string} eventName - e.g., 'ko.created' or '*' for all
   * @param {(event: import('../types/core.mjs').BarEvent) => void | Promise<void>} handler
   */
  on(eventName, handler) {
    if (!this.#handlers.has(eventName)) this.#handlers.set(eventName, []);
    this.#handlers.get(eventName).push(handler);
    return this;
  }

  /**
   * Unregister an event handler.
   * @param {string} eventName
   * @param {Function} handler
   */
  off(eventName, handler) {
    const handlers = this.#handlers.get(eventName);
    if (handlers) {
      const idx = handlers.indexOf(handler);
      if (idx >= 0) handlers.splice(idx, 1);
    }
    return this;
  }

  /**
   * Dispatch an event.
   * @param {string} eventName - Must be a valid event name from BAR
   * @param {Record<string, any>} payload
   * @returns {Promise<{ dispatched: boolean, handlers: number }>}
   */
  async dispatch(eventName, payload = {}) {
    // Validate event exists in BAR
    const eventDef = this.#registry.query(e =>
      e.kind === 'event' && e.name === eventName
    )[0];

    if (!eventDef) {
      return { dispatched: false, handlers: 0, error: `Unknown event: ${eventName}` };
    }

    const event = {
      name: eventName,
      entity: eventDef.id,
      domain: eventDef.domain,
      timestamp: new Date().toISOString(),
      payload,
    };

    // Record history
    this.#history.push(event);
    if (this.#history.length > this.#maxHistory) {
      this.#history = this.#history.slice(-this.#maxHistory);
    }

    // Find handlers
    const handlers = [
      ...(this.#handlers.get(eventName) || []),
      ...(this.#handlers.get('*') || []),
    ];

    // Execute handlers
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`Event handler error for ${eventName}:`, err);
      }
    }

    return { dispatched: true, handlers: handlers.length };
  }

  /**
   * Dispatch a capability event (convenience method).
   * @param {'created'|'updated'|'published'|'deleted'} action
   * @param {string} capabilityId
   * @param {Record<string, any>} [extra]
   */
  async capability(action, capabilityId, extra = {}) {
    const entity = this.#registry.get(capabilityId);
    if (!entity) return { dispatched: false };

    const eventName = `${entity.kind}.${action}`;
    return this.dispatch(eventName, {
      id: capabilityId,
      name: entity.name,
      domain: entity.domain,
      ...extra,
    });
  }

  /**
   * Dispatch a knowledge object event.
   * @param {'created'|'updated'|'published'|'validated'|'versioned'} action
   * @param {string} koId
   */
  async knowledgeObject(action, koId) {
    return this.dispatch(`ko.${action}`, { id: koId });
  }

  /**
   * Dispatch a workflow event.
   * @param {'started'|'completed'|'failed'} action
   * @param {string} workflowId
   * @param {Record<string, any>} [extra]
   */
  async workflow(action, workflowId, extra = {}) {
    return this.dispatch(`workflow.${action}`, { id: workflowId, ...extra });
  }

  /**
   * Dispatch a deployment event.
   * @param {'started'|'completed'|'failed'} action
   * @param {Record<string, any>} [extra]
   */
  async deploy(action, extra = {}) {
    return this.dispatch(`deploy.${action}`, extra);
  }

  /**
   * Get event history.
   * @param {number} [limit=50]
   * @param {string} [filter] - Filter by event name prefix
   */
  history(limit = 50, filter) {
    let events = this.#history;
    if (filter) events = events.filter(e => e.name.startsWith(filter));
    return events.slice(-limit);
  }

  /**
   * Get event statistics.
   */
  stats() {
    const byName = {};
    for (const e of this.#history) {
      byName[e.name] = (byName[e.name] || 0) + 1;
    }
    return {
      total: this.#history.length,
      handlers: this.#handlers.size,
      byName,
    };
  }

  /**
   * Get all registered event names from BAR.
   */
  availableEvents() {
    return this.#registry.getByKind('event').map(e => ({
      name: e.name,
      id: e.id,
      domain: e.domain,
      description: e.description,
    }));
  }
}
