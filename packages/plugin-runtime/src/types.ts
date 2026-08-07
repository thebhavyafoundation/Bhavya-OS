// Bhavya OS Plugin Runtime — Type Definitions

import type { ID, JSONObject } from "@bhavya/shared";

// ─── Plugin States ──────────────────────────────────────────────────

export type PluginState =
  | "registered"
  | "initialized"
  | "started"
  | "paused"
  | "stopped"
  | "error"
  | "unloaded";

export type PluginHealth = "healthy" | "degraded" | "unhealthy" | "unknown";

// ─── Plugin Metadata ────────────────────────────────────────────────

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  minPlatformVersion: string;
  maxPlatformVersion?: string;
}

// ─── Plugin Permissions ─────────────────────────────────────────────

export type PluginPermission =
  | "read:state"
  | "write:state"
  | "read:events"
  | "write:events"
  | "read:config"
  | "write:config"
  | "read:storage"
  | "write:storage"
  | "execute:workflow"
  | "register:capability"
  | "access:ui";

// ─── Plugin Dependencies ────────────────────────────────────────────

export interface PluginDependency {
  id: string;
  version: string;
  optional?: boolean;
}

// ─── Plugin Configuration ───────────────────────────────────────────

export interface PluginConfig {
  schema: JSONObject;
  defaults: JSONObject;
  current: JSONObject;
}

// ─── Plugin Lifecycle ───────────────────────────────────────────────

export interface PluginLifecycle {
  initialize: () => Promise<void>;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  unload: () => Promise<void>;
}

// ─── Plugin Health Check ────────────────────────────────────────────

export interface PluginHealthCheck {
  check: () => Promise<PluginHealth>;
  interval?: number;
  timeout?: number;
}

// ─── Plugin Definition ──────────────────────────────────────────────

export interface PluginDefinition {
  metadata: PluginMetadata;
  permissions: PluginPermission[];
  dependencies: PluginDependency[];
  config?: PluginConfig;
  lifecycle: PluginLifecycle;
  healthCheck?: PluginHealthCheck;
}

// ─── Plugin Instance ────────────────────────────────────────────────

export interface PluginInstance {
  definition: PluginDefinition;
  state: PluginState;
  health: PluginHealth;
  loadedAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  error?: Error;
}

// ─── Plugin Registry ────────────────────────────────────────────────

export interface PluginRegistry {
  plugins: Map<string, PluginInstance>;
  register: (definition: PluginDefinition) => Promise<void>;
  unregister: (id: string) => Promise<void>;
  get: (id: string) => PluginInstance | undefined;
  list: () => PluginInstance[];
  start: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
  pause: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
  health: () => Promise<Map<string, PluginHealth>>;
}

// ─── Plugin Events ──────────────────────────────────────────────────

export type PluginEventType =
  | "plugin:registered"
  | "plugin:initialized"
  | "plugin:started"
  | "plugin:paused"
  | "plugin:resumed"
  | "plugin:stopped"
  | "plugin:unloaded"
  | "plugin:error";

export interface PluginEvent {
  type: PluginEventType;
  pluginId: string;
  timestamp: Date;
  data?: JSONObject;
}
