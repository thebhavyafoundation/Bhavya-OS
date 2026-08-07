# Extension Development Guide

**Version:** 1.0.0 | **Platform:** Bhavya OS

---

## Overview

Bhavya OS is an extensible operating system where future capabilities are delivered as installable modules instead of modifications to the platform itself.

This guide explains how to build extensions for Bhavya OS.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Extension                           │
├─────────────────────────────────────────────────────────────┤
│                    Extension SDK                            │
├─────────────────────────────────────────────────────────────┤
│                    Plugin Runtime                           │
├─────────────────────────────────────────────────────────────┤
│                    Platform Core                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Kernel  │ │ Runtime │ │ Events  │ │ Shared  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Install SDK

```bash
npm install @bhavya/sdk
```

### 2. Create Plugin

```typescript
import { createPlugin } from "@bhavya/sdk";

const myPlugin = createPlugin(
  {
    id: "my-plugin",
    name: "My Plugin",
    version: "1.0.0",
    description: "A sample plugin",
    author: "Developer",
    minPlatformVersion: "1.0.0",
  },
  {
    permissions: ["read:state", "read:events"],
    setup: async (sdk) => {
      // Initialize plugin
      sdk.logger.info("Plugin initialized");
    },
    start: async () => {
      // Start plugin
    },
    stop: async () => {
      // Stop plugin
    },
  }
);

export default myPlugin;
```

### 3. Register Plugin

```typescript
import { PluginManager } from "@bhavya/plugin-runtime";

const manager = new PluginManager();
await manager.register(myPlugin);
await manager.start("my-plugin");
```

---

## Templates

### Application Template

```typescript
import { createApp } from "@bhavya/sdk";

const app = createApp({
  name: "my-app",
  version: "1.0.0",
  description: "My application",
  setup: async (sdk) => {
    // Access platform APIs
    const config = sdk.config.get("mySetting");
    await sdk.events.emit("app:started", { appId: "my-app" });
  },
});
```

### Worker Template

```typescript
import { createWorker } from "@bhavya/sdk";

const worker = createWorker({
  name: "my-worker",
  version: "1.0.0",
  description: "Background worker",
  setup: async (sdk) => {
    // Setup worker
  },
  execute: async () => {
    // Execute work
  },
});
```

### CLI Tool Template

```typescript
import { createCLI } from "@bhavya/sdk";

const cli = createCLI({
  name: "my-cli",
  version: "1.0.0",
  description: "CLI tool",
  setup: async (sdk) => {
    // Setup CLI
  },
  execute: async (args) => {
    console.log("Args:", args);
  },
});
```

---

## APIs

### Storage API

```typescript
// Get value
const value = await sdk.storage.get<string>("myKey");

// Set value
await sdk.storage.set("myKey", "myValue");

// Delete value
await sdk.storage.delete("myKey");

// List keys
const keys = await sdk.storage.list("prefix");
```

### Events API

```typescript
// Emit event
await sdk.events.emit("my:event", { data: "value" });

// Subscribe to event
const subId = sdk.events.on("my:event", (event) => {
  console.log("Received:", event);
});

// Unsubscribe
sdk.events.off(subId);
```

### Configuration API

```typescript
// Get config
const value = sdk.config.get<string>("myKey");

// Set config
sdk.config.set("myKey", "myValue");

// Check if exists
const exists = sdk.config.has("myKey");

// List all keys
const keys = sdk.config.keys();
```

### Workflow API

```typescript
// Start workflow
const executionId = await sdk.workflow.start("myWorkflow", { input: "value" });

// Get status
const status = await sdk.workflow.getStatus(executionId);

// Cancel workflow
await sdk.workflow.cancel(executionId);
```

### Knowledge API

```typescript
// Get object
const obj = await sdk.knowledge.get("myId");

// Search
const results = await sdk.knowledge.search("my query");

// Create
const newObj = await sdk.knowledge.create({
  type: "concept",
  title: "My Concept",
  content: { description: "..." },
  metadata: {},
});

// Update
await sdk.knowledge.update("myId", { title: "Updated" });

// Delete
await sdk.knowledge.delete("myId");
```

### Runtime API

```typescript
// Get capability
const cap = await sdk.runtime.getCapability("myCapability");

// List capabilities
const caps = await sdk.runtime.listCapabilities();

// Health check
const health = await sdk.runtime.health();

// Get metrics
const metrics = await sdk.runtime.metrics();
```

### Logging API

```typescript
sdk.logger.info("Information message", { key: "value" });
sdk.logger.warn("Warning message");
sdk.logger.error("Error message", new Error("Details"));
sdk.logger.debug("Debug message", { key: "value" });
```

---

## Permissions

| Permission | Description |
|------------|-------------|
| `read:state` | Read platform state |
| `write:state` | Modify platform state |
| `read:events` | Subscribe to events |
| `write:events` | Emit events |
| `read:config` | Read configuration |
| `write:config` | Modify configuration |
| `read:storage` | Read storage |
| `write:storage` | Write to storage |
| `execute:workflow` | Execute workflows |
| `register:capability` | Register capabilities |
| `access:ui` | Access UI components |

---

## Lifecycle

```
registered → initialized → started → paused → resumed → stopped → unloaded
```

1. **registered** — Plugin registered with manager
2. **initialized** — Plugin initialized
3. **started** — Plugin running
4. **paused** — Plugin paused
5. **resumed** — Plugin resumed from pause
6. **stopped** — Plugin stopped
7. **unloaded** — Plugin unloaded from memory

---

## Best Practices

1. **Use public APIs only** — Never import from internal paths
2. **Declare permissions** — Request only what you need
3. **Handle errors gracefully** — Plugin errors shouldn't crash the platform
4. **Clean up resources** — Stop timers, close connections in `stop()`
5. **Version your plugin** — Use semantic versioning
6. **Document your plugin** — Provide clear description and README
7. **Test your plugin** — Use the platform's testing utilities

---

## Example: Complete Plugin

```typescript
import { createPlugin, type BhavyaSDK } from "@bhavya/sdk";

let sdk: BhavyaSDK;
let interval: NodeJS.Timeout;

const myPlugin = createPlugin(
  {
    id: "health-monitor",
    name: "Health Monitor",
    version: "1.0.0",
    description: "Monitors platform health",
    author: "Developer",
    minPlatformVersion: "1.0.0",
  },
  {
    permissions: ["read:state", "read:events"],
    setup: async (s) => {
      sdk = s;
      sdk.logger.info("Health Monitor setup complete");
    },
    start: async () => {
      interval = setInterval(async () => {
        const health = await sdk.runtime.health();
        sdk.logger.info("Health check", { status: health.status });
      }, 60000);
    },
    stop: async () => {
      clearInterval(interval);
    },
  }
);

export default myPlugin;
```
