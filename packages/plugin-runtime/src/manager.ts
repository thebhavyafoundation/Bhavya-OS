// Bhavya OS Plugin Runtime — Manager Implementation

import type {
  PluginDefinition,
  PluginInstance,
  PluginRegistry,
  PluginState,
  PluginHealth,
  PluginEvent,
  PluginEventType,
} from "./types.js";

export class PluginManager implements PluginRegistry {
  plugins: Map<string, PluginInstance> = new Map();
  private eventListeners: Map<PluginEventType, Set<(event: PluginEvent) => void>> = new Map();

  async register(definition: PluginDefinition): Promise<void> {
    const { id } = definition.metadata;

    if (this.plugins.has(id)) {
      throw new Error(`Plugin ${id} already registered`);
    }

    // Validate dependencies
    for (const dep of definition.dependencies) {
      if (!dep.optional && !this.plugins.has(dep.id)) {
        throw new Error(`Required dependency ${dep.id} not found`);
      }
    }

    const instance: PluginInstance = {
      definition,
      state: "registered",
      health: "unknown",
      loadedAt: new Date(),
    };

    this.plugins.set(id, instance);
    this.emit("plugin:registered", id);

    // Initialize immediately
    await this.initialize(id);
  }

  async unregister(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    // Stop if running
    if (instance.state === "started" || instance.state === "paused") {
      await this.stop(id);
    }

    // Unload
    await instance.definition.lifecycle.unload();
    instance.state = "unloaded";
    this.emit("plugin:unloaded", id);

    this.plugins.delete(id);
  }

  get(id: string): PluginInstance | undefined {
    return this.plugins.get(id);
  }

  list(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }

  async start(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    if (instance.state !== "initialized" && instance.state !== "stopped") {
      throw new Error(`Plugin ${id} cannot be started from state ${instance.state}`);
    }

    await instance.definition.lifecycle.start();
    instance.state = "started";
    instance.startedAt = new Date();
    this.emit("plugin:started", id);
  }

  async stop(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    if (instance.state !== "started" && instance.state !== "paused") {
      throw new Error(`Plugin ${id} cannot be stopped from state ${instance.state}`);
    }

    await instance.definition.lifecycle.stop();
    instance.state = "stopped";
    instance.stoppedAt = new Date();
    this.emit("plugin:stopped", id);
  }

  async pause(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    if (instance.state !== "started") {
      throw new Error(`Plugin ${id} cannot be paused from state ${instance.state}`);
    }

    await instance.definition.lifecycle.pause();
    instance.state = "paused";
    this.emit("plugin:paused", id);
  }

  async resume(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    if (instance.state !== "paused") {
      throw new Error(`Plugin ${id} cannot be resumed from state ${instance.state}`);
    }

    await instance.definition.lifecycle.resume();
    instance.state = "started";
    this.emit("plugin:resumed", id);
  }

  async health(): Promise<Map<string, PluginHealth>> {
    const healthMap = new Map<string, PluginHealth>();

    for (const [id, instance] of this.plugins) {
      if (instance.definition.healthCheck) {
        try {
          instance.health = await instance.definition.healthCheck.check();
        } catch {
          instance.health = "unhealthy";
        }
      } else {
        instance.health = instance.state === "started" ? "healthy" : "unknown";
      }
      healthMap.set(id, instance.health);
    }

    return healthMap;
  }

  async initialize(id: string): Promise<void> {
    const instance = this.plugins.get(id);
    if (!instance) {
      throw new Error(`Plugin ${id} not found`);
    }

    await instance.definition.lifecycle.initialize();
    instance.state = "initialized";
    this.emit("plugin:initialized", id);
  }

  // ─── Event System ─────────────────────────────────────────────────

  on(type: PluginEventType, listener: (event: PluginEvent) => void): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)!.add(listener);
  }

  off(type: PluginEventType, listener: (event: PluginEvent) => void): void {
    this.eventListeners.get(type)?.delete(listener);
  }

  private emit(type: PluginEventType, pluginId: string, data?: unknown): void {
    const event: PluginEvent = {
      type,
      pluginId,
      timestamp: new Date(),
      data: data as Record<string, unknown>,
    };

    this.eventListeners.get(type)?.forEach((listener) => listener(event));
  }
}
