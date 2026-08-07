# Architecture v2.0

**Date:** 2026-08-07 | **Status:** Stable | **Version:** 2.0

---

## Overview

Bhavya OS is an extensible operating system where future capabilities are delivered as installable modules instead of modifications to the platform itself.

---

## Core Principles

1. **Stable Core** — Platform kernel is frozen and immutable
2. **Modular Extensions** — New capabilities are plugins
3. **Event-Driven Communication** — Loose coupling via events
4. **Versioned Contracts** — All APIs are versioned
5. **Zero Core Modification** — No core changes for new features

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        Applications                             │
│  website, forest, dashboard, knowledge, heritage, etc.         │
├─────────────────────────────────────────────────────────────────┤
│                        Extensions                               │
│  plugins, workers, CLI tools, custom apps                      │
├─────────────────────────────────────────────────────────────────┤
│                        Extension SDK                            │
│  createPlugin, createApp, createWorker, createCLI              │
├─────────────────────────────────────────────────────────────────┤
│                        Platform Core                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ Kernel  │ │ Runtime │ │ Events  │ │ Shared  │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │  UI     │ │ Config  │ │ Plugins │ │ Registry│            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────────────────────┤
│                        Tooling                                  │
│  eslint, typescript, quality gates                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Packages (15)

| Package | Version | Description |
|---------|---------|-------------|
| `@bhavya/kernel` | 3.1.0 | Core kernel with BRP types |
| `@bhavya/runtime` | 0.1.0 | Engine pipeline |
| `@bhavya/shared` | 1.0.0 | Canonical types (100+) |
| `@bhavya/platform-ui` | 0.1.0 | UI components |
| `@bhavya/events` | 0.1.0 | Event bus |
| `@bhavya/config` | 0.1.0 | Configuration |
| `@bhavya/plugin-runtime` | 1.0.0 | Plugin lifecycle |
| `@bhavya/capability-registry` | 1.0.0 | Capability registry |
| `@bhavya/content-core` | 0.6.0 | Content pipeline |
| `@bhavya/knowledge-graph` | 1.0.0 | Knowledge graph |
| `@bhavya/mission-runtime` | 0.6.0 | Mission execution |
| `@bhavya/agent-engine` | 0.1.0 | Agent management |
| `@bhavya/types` | 0.1.0 | Type re-exports |
| `@bhavya/sdk` | 0.1.0 | Extension SDK |
| `@bhavya/constitution` | 1.0.0 | Governance docs |

---

## Extension Points

### 1. Plugin System

```typescript
import { createPlugin } from "@bhavya/sdk";

const plugin = createPlugin({
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",
  // ...
}, {
  setup: async (sdk) => { /* ... */ },
});

await pluginManager.register(plugin);
```

### 2. Event System

```typescript
// Emit event
await sdk.events.emit("my:event", { data: "value" });

// Subscribe
sdk.events.on("my:event", (event) => {
  console.log(event);
});
```

### 3. Storage System

```typescript
// Store data
await sdk.storage.set("key", value);

// Retrieve data
const value = await sdk.storage.get("key");
```

### 4. Workflow System

```typescript
// Start workflow
const id = await sdk.workflow.start("workflowId", input);

// Check status
const status = await sdk.workflow.getStatus(id);
```

### 5. Knowledge System

```typescript
// Create knowledge
const obj = await sdk.knowledge.create({
  type: "concept",
  title: "My Concept",
  content: {},
  metadata: {},
});

// Search
const results = await sdk.knowledge.search("query");
```

---

## Event Categories

| Category | Description |
|----------|-------------|
| `system` | Platform startup, shutdown, errors |
| `runtime` | Engine and pipeline events |
| `agent` | Agent lifecycle events |
| `workflow` | Workflow execution events |
| `knowledge` | Knowledge object events |
| `application` | Application lifecycle events |
| `security` | Authentication and authorization |
| `audit` | Audit trail events |

---

## Plugin Lifecycle

```
registered → initialized → started → paused → resumed → stopped → unloaded
```

---

## Dependency Direction

```
Applications → Extensions → SDK → Core → Shared
```

No upward dependencies allowed.

---

## Contracts

All core packages have frozen contracts in `contracts/` directory:

- `shared` — 100+ types
- `kernel` — BRP-specific types
- `platform-ui` — UI components
- `content-core` — Content pipeline
- `knowledge-graph` — Knowledge graph
- `mission-runtime` — Mission execution
- `runtime` — Engine pipeline
- `agents` — Agent management
- `events` — Event system
- `plugins` — Plugin system
- `services` — Service registry

---

## Quality Gates

1. Shared package has 50+ types
2. No duplicate type definitions
3. No deprecated package imports
4. No circular dependencies
5. Constitution docs exist

---

## Future Vision

1. **App Store** — Install extensions from marketplace
2. **Auto-discovery** — Extensions discovered at startup
3. **Dependency resolution** — Automatic dependency installation
4. **Version management** — Automatic updates
5. **Sandboxing** — Plugin isolation
6. **Marketplace** — Community extensions

---

## See Also

- [Extension Guide](extension-guide.md)
- [SDK Reference](sdk-reference.md)
- [Platform Maturity Report](../audit/platform-maturity.md)
