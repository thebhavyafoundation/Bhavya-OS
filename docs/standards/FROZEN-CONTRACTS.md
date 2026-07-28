# Frozen Contracts

**Version:** 1.3.0-alpha
**Status:** Frozen
**Last Updated:** 2026-07-28

---

## What is Frozen

These contracts are stable public interfaces. Future improvements happen **behind** these interfaces, not by changing them.

| Contract | Location | Status |
|----------|----------|--------|
| BRP v1 | `docs/architecture/BRP.md` | Frozen |
| Kernel interfaces | `packages/kernel/src/types/index.ts` | Frozen |
| Package namespace | `@bhavya/*` | Frozen |
| ExecutionContext | `packages/kernel/src/types/index.ts` | Frozen |
| Event model | `packages/kernel/src/events/index.ts` | Frozen |
| Memory API | `packages/kernel/src/memory/index.ts` | Frozen |
| Registry API | `packages/kernel/src/registry/index.ts` | Frozen |
| Coordinator API | `packages/kernel/src/coordinator/index.ts` | Frozen (v1.3.0) |
| Replay API | `packages/kernel/src/replay/index.ts` | Frozen (v1.3.0) |
| Service Interface | `packages/kernel/src/services/index.ts` | Frozen (v1.3.0) |

## Rules

1. **No breaking changes** to frozen interfaces
2. **New capabilities** are added as new modules, not by modifying existing ones
3. **Implementation changes** happen behind the interface
4. **Version bumps** are required for any interface change

## BRP v1 (Frozen)

```
Goal → Plan → Task → Event → Memory → Knowledge → Result
```

## ExecutionContext (Frozen)

```typescript
interface ExecutionContext {
  executionId: string;
  parentExecutionId?: string;
  triggeringEvent?: string;
  initiatingAgent?: string;
  correlationId: string;
  timestamps: ExecutionTimestamps;
  retryCount: number;
  maxRetries: number;
  state: ExecutionState;
  metadata: Record<string, unknown>;
}
```

## Event Model (Frozen)

```typescript
interface Event {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  metadata: Record<string, unknown>;
  context?: ExecutionContext;
}
```

## Memory API (Frozen)

```typescript
interface MemoryEngine {
  get(id: string): Promise<MemoryEntry | undefined>;
  getByType(type: MemoryType): Promise<MemoryEntry[]>;
  getAll(): Promise<MemoryEntry[]>;
  set(entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryEntry>;
  update(id: string, updates: Partial<MemoryEntry>): Promise<MemoryEntry | undefined>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<MemoryEntry[]>;
}
```

## Registry API (Frozen)

```typescript
interface Registry {
  discover(type: RegistryType): Promise<RegistryEntry[]>;
  get(type: RegistryType): RegistryEntry[];
  getById(id: string): RegistryEntry | undefined;
  getAll(): RegistryEntry[];
}
```

## Coordinator API (Frozen — v1.3.0)

```typescript
interface Coordinator {
  execute(config: CoordinatorConfig): Promise<ExecutionReport>;
  getExecutionHistory(): Promise<ExecutionReport[]>;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

interface CoordinatorConfig {
  name: string;
  steps: CoordinatorStep[];
  context?: ExecutionContext;
}

interface ExecutionReport {
  name: string;
  success: boolean;
  outputs: Record<string, unknown>;
  duration: number;
  agentExecutions: AgentExecution[];
  timestamp: Date;
}
```

## Replay API (Frozen — v1.3.0)

```typescript
interface ReplayEngine {
  replay(executionId: string): Promise<ReplayResult>;
  resume(executionId: string): Promise<ReplayResult>;
  getReplayHistory(executionId: string): Promise<ReplayResult[]>;
  getAllReplays(): Promise<ReplayResult[]>;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

interface ReplayResult {
  executionId: string;
  originalStatus: ExecutionState;
  replayedEvents: number;
  newStatus: ExecutionState;
  context: ExecutionContext;
  duration: number;
  timestamp: Date;
}
```

## Service Interface (Frozen — v1.3.0)

```typescript
interface InstitutionService {
  name: string;
  description: string;
  capabilities: string[];
  initialize(): Promise<void>;
  execute(input: unknown): Promise<unknown>;
  shutdown(): Promise<void>;
}
```

## What Can Change

- Implementation details behind interfaces
- New modules and services
- New engine packages
- Configuration options
- Performance optimizations

## What Cannot Change

- Function signatures of frozen APIs
- Type definitions of frozen interfaces
- Event type names
- Memory entry structure
- Registry entry structure
- Package namespace convention

---

**Future improvements happen behind these interfaces.**
