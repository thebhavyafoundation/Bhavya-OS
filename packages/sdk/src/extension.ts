// Bhavya OS Extension SDK — Public API for Extension Developers

import type {
  PluginDefinition,
  PluginMetadata,
  PluginPermission,
  PluginConfig,
} from "@bhavya/plugin-runtime";
import type { BhavyaEvent, EventHandler } from "@bhavya/events";

// ─── Application API ────────────────────────────────────────────────

export interface AppContext {
  appId: string;
  config: Record<string, unknown>;
  storage: StorageAPI;
  events: EventsAPI;
  logger: LoggingAPI;
}

export interface StorageAPI {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (prefix: string) => Promise<string[]>;
}

// ─── Events API ─────────────────────────────────────────────────────

export interface EventsAPI {
  emit: <T>(type: string, payload: T) => Promise<void>;
  on: (type: string, handler: EventHandler) => string;
  off: (subscriptionId: string) => void;
}

// ─── Logging API ────────────────────────────────────────────────────

export interface LoggingAPI {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: Error) => void;
  debug: (message: string, data?: Record<string, unknown>) => void;
}

// ─── Configuration API ──────────────────────────────────────────────

export interface ConfigurationAPI {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
  has: (key: string) => boolean;
  keys: () => string[];
}

// ─── Workflow API ───────────────────────────────────────────────────

export interface WorkflowAPI {
  start: (workflowId: string, input: Record<string, unknown>) => Promise<string>;
  getStatus: (executionId: string) => Promise<WorkflowStatus>;
  cancel: (executionId: string) => Promise<void>;
}

export interface WorkflowStatus {
  executionId: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress?: number;
  result?: unknown;
  error?: string;
}

// ─── Knowledge API ──────────────────────────────────────────────────

export interface KnowledgeAPI {
  get: (id: string) => Promise<KnowledgeObject | null>;
  search: (query: string) => Promise<KnowledgeObject[]>;
  create: (object: Omit<KnowledgeObject, "id">) => Promise<KnowledgeObject>;
  update: (id: string, updates: Partial<KnowledgeObject>) => Promise<KnowledgeObject>;
  delete: (id: string) => Promise<void>;
}

export interface KnowledgeObject {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Runtime API ────────────────────────────────────────────────────

export interface RuntimeAPI {
  getCapability: (name: string) => Promise<CapabilityInfo | null>;
  listCapabilities: () => Promise<CapabilityInfo[]>;
  health: () => Promise<HealthStatus>;
  metrics: () => Promise<MetricsData>;
}

export interface CapabilityInfo {
  name: string;
  version: string;
  description: string;
  status: "active" | "inactive" | "error";
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  components: Record<string, "ok" | "error">;
}

export interface MetricsData {
  uptime: number;
  requests: number;
  errors: number;
  memory: number;
}

// ─── UI API ─────────────────────────────────────────────────────────

export interface UIAPI {
  registerComponent: (name: string, component: unknown) => void;
  unregisterComponent: (name: string) => void;
  render: (name: string, props: Record<string, unknown>) => unknown;
}

// ─── SDK Interface ──────────────────────────────────────────────────

export interface BhavyaSDK {
  app: AppContext;
  events: EventsAPI;
  storage: StorageAPI;
  config: ConfigurationAPI;
  workflow: WorkflowAPI;
  knowledge: KnowledgeAPI;
  runtime: RuntimeAPI;
  ui: UIAPI;
  logger: LoggingAPI;
}

// ─── Plugin Template ────────────────────────────────────────────────

export function createPlugin(
  metadata: PluginMetadata,
  options: {
    permissions?: PluginPermission[];
    config?: PluginConfig;
    setup: (sdk: BhavyaSDK) => Promise<void>;
    start?: () => Promise<void>;
    stop?: () => Promise<void>;
  },
): PluginDefinition {
  return {
    metadata,
    permissions: options.permissions || [],
    dependencies: [],
    config: options.config,
    lifecycle: {
      initialize: () => options.setup(null as unknown as BhavyaSDK),
      start: options.start || (async () => {}),
      pause: async () => {},
      resume: async () => {},
      stop: options.stop || (async () => {}),
      unload: async () => {},
    },
  };
}

// ─── Application Template ───────────────────────────────────────────

export function createApp(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
}): PluginDefinition {
  return createPlugin(
    {
      id: `app:${config.name}`,
      name: config.name,
      version: config.version,
      description: config.description,
      author: "Bhavya OS",
      minPlatformVersion: "1.0.0",
    },
    {
      permissions: ["read:state", "read:events", "read:config", "access:ui"],
      setup: config.setup,
    },
  );
}

// ─── Worker Template ────────────────────────────────────────────────

export function createWorker(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
  execute: () => Promise<void>;
}): PluginDefinition {
  return createPlugin(
    {
      id: `worker:${config.name}`,
      name: config.name,
      version: config.version,
      description: config.description,
      author: "Bhavya OS",
      minPlatformVersion: "1.0.0",
    },
    {
      permissions: ["read:state", "read:events", "execute:workflow"],
      setup: config.setup,
      start: config.execute,
    },
  );
}

// ─── CLI Tool Template ──────────────────────────────────────────────

export function createCLI(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
  execute: (args: string[]) => Promise<void>;
}): PluginDefinition {
  return createPlugin(
    {
      id: `cli:${config.name}`,
      name: config.name,
      version: config.version,
      description: config.description,
      author: "Bhavya OS",
      minPlatformVersion: "1.0.0",
    },
    {
      permissions: ["read:state", "read:config"],
      setup: config.setup,
      start: () => config.execute(process.argv.slice(2)),
    },
  );
}
