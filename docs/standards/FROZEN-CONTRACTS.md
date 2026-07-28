# Frozen Contracts

**Version:** 1.4.0-alpha
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
| Coordinator API | `packages/kernel/src/coordinator/index.ts` | Frozen |
| Replay API | `packages/kernel/src/replay/index.ts` | Frozen |
| Service Interface | `packages/kernel/src/services/index.ts` | Frozen |
| Self-Organizing API | `packages/kernel/src/self-organizing/index.ts` | Frozen (v1.4.0) |
| Orchestrator API | `packages/kernel/src/orchestrator/index.ts` | Frozen (v1.4.0) |
| Consensus API | `packages/kernel/src/consensus/index.ts` | Frozen (v1.4.0) |
| Capability Matcher API | `packages/kernel/src/capability-matcher/index.ts` | Frozen (v1.4.0) |

## Rules

1. **No breaking changes** to frozen interfaces
2. **New capabilities** are added as new modules, not by modifying existing ones
3. **Implementation changes** happen behind the interface
4. **Version bumps** are required for any interface change

## BRP v1 (Frozen)

```
Goal → Plan → Task → Event → Memory → Knowledge → Result
```

## Self-Organizing API (Frozen — v1.4.0)

```typescript
interface SelfOrganizingEngine {
  discoverWork(signal: WorkSignal): Promise<WorkItem>;
  attemptAssignment(): Promise<void>;
  assignWork(workItemId: string, agentId: string): Promise<void>;
  startWork(workItemId: string): Promise<void>;
  completeWork(workItemId: string, output?: unknown): Promise<void>;
  getWorkItems(status?: WorkItemStatus): Promise<WorkItem[]>;
  getUnassigned(): Promise<WorkItem[]>;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Orchestrator API (Frozen — v1.4.0)

```typescript
interface EventDrivenOrchestrator {
  registerTrigger(trigger: WorkflowTrigger): string;
  setTriggerEnabled(triggerId: string, enabled: boolean): void;
  getExecutionLog(): ExecutionLogEntry[];
  getTriggers(): WorkflowTrigger[];
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Consensus API (Frozen — v1.4.0)

```typescript
interface ConsensusEngine {
  createProposal(input: ProposalInput): Promise<Proposal>;
  castVote(proposalId: string, vote: Vote): Promise<Proposal | null>;
  getProposal(id: string): Proposal | undefined;
  getProposals(status?: ProposalStatus): Proposal[];
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Capability Matcher API (Frozen — v1.4.0)

```typescript
interface CapabilityMatcher {
  match(request: MatchingRequest): Promise<MatchingResult>;
  matchBatch(requests: MatchingRequest[]): Promise<MatchingResult[]>;
  getUtilization(): UtilizationReport[];
  initialize(): Promise<void>;
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
