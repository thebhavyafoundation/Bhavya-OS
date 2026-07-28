// Bhavya Kernel — API Module
// Kernel API surface.

import type { RuntimeContext } from '../runtime/index.js';

export interface ApiConfig {
  kernel: RuntimeContext;
}

export class Api {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // API ready
  }

  // Expose kernel capabilities through a stable interface
  get kernel() {
    return this.config.kernel;
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
