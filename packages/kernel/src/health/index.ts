// Bhavya Kernel — Health Module
// Health checks and monitoring.

import type { HealthStatus, ComponentHealth } from '../types/index.js';

export class Health {
  private components = new Map<string, ComponentHealth>();

  async initialize(): Promise<void> {
    // Register kernel self
n    this.components.set('kernel', {
      name: 'kernel',
      status: 'healthy',
    });
  }

  async check(): Promise<HealthStatus> {
    const components = Array.from(this.components.values());
    const status = components.every((c) => c.status === 'healthy')
      ? 'healthy'
      : components.some((c) => c.status === 'unhealthy')
        ? 'unhealthy'
        : 'degraded';

    return {
      status,
      components,
      timestamp: new Date(),
    };
  }

  register(name: string): void {
    this.components.set(name, {
      name,
      status: 'healthy',
    });
  }

  updateStatus(name: string, status: ComponentHealth['status'], message?: string): void {
    const existing = this.components.get(name);
    if (existing) {
      existing.status = status;
      existing.message = message;
    }
  }

  async shutdown(): Promise<void> {
    this.components.clear();
  }
}
