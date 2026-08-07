# SDK Reference

**Version:** 1.0.0 | **Package:** @bhavya/sdk

---

## Installation

```bash
npm install @bhavya/sdk
```

---

## Exports

### Functions

| Function | Description |
|----------|-------------|
| `createPlugin(metadata, options)` | Create a plugin definition |
| `createApp(config)` | Create an application |
| `createWorker(config)` | Create a background worker |
| `createCLI(config)` | Create a CLI tool |

### Types

| Type | Description |
|------|-------------|
| `BhavyaSDK` | Main SDK interface |
| `AppContext` | Application context |
| `StorageAPI` | Storage operations |
| `EventsAPI` | Event operations |
| `LoggingAPI` | Logging operations |
| `ConfigurationAPI` | Configuration operations |
| `WorkflowAPI` | Workflow operations |
| `KnowledgeAPI` | Knowledge operations |
| `RuntimeAPI` | Runtime operations |
| `UIAPI` | UI operations |
| `WorkflowStatus` | Workflow status |
| `KnowledgeObject` | Knowledge object |
| `CapabilityInfo` | Capability information |
| `HealthStatus` | Health status |
| `MetricsData` | Metrics data |

---

## API Reference

### createPlugin

```typescript
function createPlugin(
  metadata: PluginMetadata,
  options: {
    permissions?: PluginPermission[];
    config?: PluginConfig;
    setup: (sdk: BhavyaSDK) => Promise<void>;
    start?: () => Promise<void>;
    stop?: () => Promise<void>;
  }
): PluginDefinition
```

Creates a plugin definition for use with PluginManager.

**Parameters:**

- `metadata` — Plugin metadata (id, name, version, etc.)
- `options` — Plugin options (permissions, setup, lifecycle)

**Returns:** PluginDefinition

---

### createApp

```typescript
function createApp(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
}): PluginDefinition
```

Creates an application plugin with standard permissions.

**Parameters:**

- `config` — Application configuration

**Returns:** PluginDefinition with `read:state`, `read:events`, `read:config`, `access:ui` permissions

---

### createWorker

```typescript
function createWorker(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
  execute: () => Promise<void>;
}): PluginDefinition
```

Creates a background worker plugin.

**Parameters:**

- `config` — Worker configuration

**Returns:** PluginDefinition with `read:state`, `read:events`, `execute:workflow` permissions

---

### createCLI

```typescript
function createCLI(config: {
  name: string;
  version: string;
  description: string;
  setup: (sdk: BhavyaSDK) => Promise<void>;
  execute: (args: string[]) => Promise<void>;
}): PluginDefinition
```

Creates a CLI tool plugin.

**Parameters:**

- `config` — CLI configuration

**Returns:** PluginDefinition with `read:state`, `read:config` permissions

---

## BhavyaSDK Interface

```typescript
interface BhavyaSDK {
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
```

---

## StorageAPI

```typescript
interface StorageAPI {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (prefix: string) => Promise<string[]>;
}
```

---

## EventsAPI

```typescript
interface EventsAPI {
  emit: <T>(type: string, payload: T) => Promise<void>;
  on: (type: string, handler: EventHandler) => string;
  off: (subscriptionId: string) => void;
}
```

---

## LoggingAPI

```typescript
interface LoggingAPI {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: Error) => void;
  debug: (message: string, data?: Record<string, unknown>) => void;
}
```

---

## ConfigurationAPI

```typescript
interface ConfigurationAPI {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
  has: (key: string) => boolean;
  keys: () => string[];
}
```

---

## WorkflowAPI

```typescript
interface WorkflowAPI {
  start: (workflowId: string, input: Record<string, unknown>) => Promise<string>;
  getStatus: (executionId: string) => Promise<WorkflowStatus>;
  cancel: (executionId: string) => Promise<void>;
}

interface WorkflowStatus {
  executionId: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress?: number;
  result?: unknown;
  error?: string;
}
```

---

## KnowledgeAPI

```typescript
interface KnowledgeAPI {
  get: (id: string) => Promise<KnowledgeObject | null>;
  search: (query: string) => Promise<KnowledgeObject[]>;
  create: (object: Omit<KnowledgeObject, "id">) => Promise<KnowledgeObject>;
  update: (id: string, updates: Partial<KnowledgeObject>) => Promise<KnowledgeObject>;
  delete: (id: string) => Promise<void>;
}

interface KnowledgeObject {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## RuntimeAPI

```typescript
interface RuntimeAPI {
  getCapability: (name: string) => Promise<CapabilityInfo | null>;
  listCapabilities: () => Promise<CapabilityInfo[]>;
  health: () => Promise<HealthStatus>;
  metrics: () => Promise<MetricsData>;
}

interface CapabilityInfo {
  name: string;
  version: string;
  description: string;
  status: "active" | "inactive" | "error";
}

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  components: Record<string, "ok" | "error">;
}

interface MetricsData {
  uptime: number;
  requests: number;
  errors: number;
  memory: number;
}
```

---

## UIAPI

```typescript
interface UIAPI {
  registerComponent: (name: string, component: unknown) => void;
  unregisterComponent: (name: string) => void;
  render: (name: string, props: Record<string, unknown>) => unknown;
}
```
