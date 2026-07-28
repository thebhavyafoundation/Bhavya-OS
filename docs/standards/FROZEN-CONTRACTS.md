# Frozen Contracts

**Version:** 2.0.0-beta
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
| Self-Organizing API | `packages/kernel/src/self-organizing/index.ts` | Frozen |
| Orchestrator API | `packages/kernel/src/orchestrator/index.ts` | Frozen |
| Consensus API | `packages/kernel/src/consensus/index.ts` | Frozen |
| Capability Matcher API | `packages/kernel/src/capability-matcher/index.ts` | Frozen |
| Production Config API | `packages/kernel/src/configuration/production.ts` | Frozen (v2.0.0) |
| Auth API | `packages/kernel/src/auth/index.ts` | Frozen (v2.0.0) |
| Rate Limit API | `packages/kernel/src/rate-limit/index.ts` | Frozen (v2.0.0) |
| Monitoring API | `packages/kernel/src/monitoring/index.ts` | Frozen (v2.0.0) |
| Backup API | `packages/kernel/src/backup/index.ts` | Frozen (v2.0.0) |

## Rules

1. **No breaking changes** to frozen interfaces
2. **New capabilities** are added as new modules, not by modifying existing ones
3. **Implementation changes** happen behind the interface
4. **Version bumps** are required for any interface change

## Auth API (Frozen — v2.0.0)

```typescript
interface Auth {
  issueToken(subject: string, roles: string[], durationMs?: number): Promise<AuthToken>;
  validateToken(tokenId: string): Promise<{ valid: boolean; token?: AuthToken; reason?: string }>;
  checkPermission(tokenId: string, permission: string): Promise<boolean>;
  revokeToken(tokenId: string): Promise<void>;
  refreshToken(tokenId: string): Promise<AuthToken | null>;
  defineRole(role: Role): void;
  getRole(name: string): Role | undefined;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Rate Limit API (Frozen — v2.0.0)

```typescript
interface RateLimiter {
  check(context: Record<string, unknown>): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
  getStats(): { activeKeys: number; blockedKeys: number };
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Monitoring API (Frozen — v2.0.0)

```typescript
interface Monitoring {
  record(name: string, value: number, tags?: Record<string, string>): void;
  increment(name: string, tags?: Record<string, string>): void;
  raiseAlert(severity: AlertSeverity, title: string, message: string, source: string): void;
  onAlert(handler: (alert: Alert) => void): () => void;
  acknowledge(alertId: string): boolean;
  getMetrics(name?: string): Metric[];
  getAlerts(severity?: AlertSeverity): Alert[];
  getSummary(): Record<string, unknown>;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
```

## Backup API (Frozen — v2.0.0)

```typescript
interface BackupRecovery {
  createBackup(): Promise<Backup>;
  restore(backupId: string): Promise<RecoveryResult>;
  getBackups(): Backup[];
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
