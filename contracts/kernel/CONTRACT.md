# @bhavya/kernel — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Exports

### BRP-Specific Types (NOT in @bhavya/shared)
- `ExecutionContext` — Workflow execution context
- `ExecutionTimestamps` — Timing data
- `ExecutionState` — State machine
- `WorkflowConfig` — Configuration
- `WorkflowMetrics` — Performance metrics
- `StepConfig`, `StepMetrics`, `StepStatus` — Step-level types
- `AgentConfig`, `AgentMetrics`, `AgentContext` — Agent runtime types
- `TaskConfig`, `TaskMetrics`, `TaskContext` — Task runtime types
- `TaskDependency`, `TaskSchedule` — Scheduling
- `RegistryEntry`, `RegistryType`, `RegistryQuery`, `RegistryMetrics` — Registry
- `QualityGate`, `QualityGateResult`, `QualityGateConfig` — Quality gates
- `ObservabilityConfig`, `MetricsConfig`, `LoggingConfig`, `TracingConfig` — Observability
- `WorkflowStatusEntry`, `AgentStatusEntry`, `TaskStatusEntry`, `MemoryStatusEntry` — Status tracking
- `ObservabilityMetrics`, `MetricPoint`, `MetricSeries`, `MetricQuery`, `MetricQueryResult` — Metrics

### Re-exports from @bhavya/shared
All shared types are re-exported for backward compatibility. New code should import directly from `@bhavya/shared`.

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **BRP types:** May evolve independently of shared types
