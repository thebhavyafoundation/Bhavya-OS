# @bhavya/shared — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Exports (100+ types)

### Core Domain Types
- `Workflow`, `WorkflowStep`, `WorkflowStatus`, `WorkflowTrigger`
- `Agent`, `AgentStatus`
- `Task`, `TaskStatus`
- `Memory`, `MemoryPriority`, `MemoryStatus`, `MemoryType`
- `Goal`, `GoalStatus`, `KPI`
- `Plan`, `PlanStep`, `PlanStatus`
- `Event`, `EventPriority`, `EventType`, `EventStatus`, `EventHandler`
- `Priority`

### Educational Types
- `EducationalContent` (alias: `KnowledgePackage`)
- `LearningOutcome`, `AssessmentQuestion`, `KnowledgePrerequisite`
- `LabModule`, `Resource`, `CertificationCriteria`

### Platform Types
- `User`, `UserRole`, `Permission`
- `Artifact`, `Schema`
- `AgentCapability`, `Capability`, `CapabilityMatchResult`

### Shared Enums
- `WorkflowStatusEnum` (pending | running | completed | failed | cancelled | paused)
- `AgentStatusEnum` (idle | busy | error | offline | maintenance)
- `TaskStatusEnum` (pending | assigned | running | completed | failed | cancelled)
- `MemoryPriorityEnum` (low | medium | high | critical)
- `MemoryStatusEnum` (active | archived | deleted)
- `MemoryTypeEnum` (short | long | episodic | semantic | procedural)
- `GoalStatusEnum` (active | completed | failed | cancelled | on_hold)
- `PlanStatusEnum` (draft | active | completed | failed | cancelled)
- `EventPriorityEnum` (low | medium | high | critical)
- `EventTypeEnum` (system | user | agent | task | workflow | memory | knowledge)
- `EventStatusEnum` (pending | processing | completed | failed | retrying)
- `PermissionEnum` (read | write | delete | admin | execute | approve)
- `PriorityEnum` (low | medium | high | critical)

### Utility Types
- `ID` (branded string type)
- `Timestamp` (Date type)
- `JSONValue`, `JSONObject`

### Workflow Types
- `WorkflowContext`, `WorkflowMetrics`, `WorkflowConfig`
- `ExecutionState`, `ExecutionTimestamps`
- `StepType`, `StepStatus`, `StepConfig`, `StepMetrics`

### Event Types
- `EventMetadata`, `EventFilter`, `EventSubscription`
- `EventMetrics`, `EventQueueConfig`

### Memory Types
- `MemoryMetadata`, `MemoryMetrics`, `MemoryConfig`
- `MemoryContext`, `MemorySearchResult`, `MemorySearchOptions`
- `MemoryConsolidationResult`, `MemoryArchivalResult`

### Planning Types
- `PlanningContext`, `PlanningMetrics`, `PlanningConfig`
- `GoalMetrics`, `GoalHierarchy`, `GoalDependency`
- `KPI`, `PlanMetrics`, `PlanDependency`

### Agent Types
- `AgentConfig`, `AgentMetrics`, `AgentContext`

### Task Types
- `TaskConfig`, `TaskMetrics`, `TaskContext`
- `TaskDependency`, `TaskSchedule`

### Educational Types (Extended)
- `EducationalObjective`, `EducationalAssessment`
- `EducationalResource`, `EducationalMetadata`

---

## Breaking Change Policy

1. **Minor version bump** for additive changes (new optional fields, new types)
2. **Major version bump** for removing/renaming exports
3. **Deprecation period:** 2 releases before removal
4. **All changes require:** PR review + quality gate pass

---

## Consumers

| Consumer | Import Style |
|----------|-------------|
| `@bhavya/kernel` | Named imports |
| `@bhavya/agent-engine` | Named imports |
| `@bhavya/mission-runtime` | Named imports |
| `@bhavya/runtime` | Named imports |
| `@bhavya/types` | Barrel re-export |
| `@bhavya/knowledge-graph` | Named imports |
