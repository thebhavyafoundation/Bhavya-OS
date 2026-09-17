// Bhavya Kernel — Configuration Module
// Config management.

import type { KernelConfig } from "../types/index.js";
import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";

export class Configuration {
  private config: KernelConfig;
  private loaded: Record<string, unknown> = {};

  constructor(config: KernelConfig) {
    this.config = config;
  }

  async load(): Promise<void> {
    const configPath = this.config.config
      ? resolve(this.config.root, this.config.config)
      : resolve(this.config.root, "bhavya.config.ts");

    if (existsSync(configPath)) {
      const content = readFileSync(configPath, "utf-8");
      // Simple config parsing (would use dynamic import in production)
      this.loaded = { raw: content };
    }

    // Merge with defaults
    this.loaded = {
      root: this.config.root,
      logLevel: this.config.logLevel ?? "info",
      ...this.loaded,
    };
  }

  get<T = unknown>(key: string): T | undefined {
    return key
      .split(".")
      .reduce(
        (obj: Record<string, unknown> | undefined, k) =>
          obj?.[k] as Record<string, unknown> | undefined,
        this.loaded as Record<string, unknown>,
      ) as T;
  }

  set(key: string, value: unknown): void {
    const keys = key.split(".");
    let obj: Record<string, unknown> = this.loaded as Record<string, unknown>;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  }

  getAll(): Record<string, unknown> {
    return this.loaded;
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
