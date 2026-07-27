/**
 * Bhavya OS Runtime Engines
 *
 * Core intelligence engines for the Bhavya Foundation Operating System.
 * These engines provide the AI capabilities for decision-making, learning,
 * and governance.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Engines ──────────────────────────────────────────────────────────────────

export { MemoryEngine } from "./memory-engine";
export type {
  Memory,
  MemoryType,
  MemoryPriority,
  MemoryStatus,
  MemoryRelation,
  MemoryQuery,
  MemorySearchResult,
  MemoryStats,
} from "./memory-engine";

export { DecisionEngine } from "./decision-engine";
export type {
  Decision,
  DecisionStatus,
  DecisionImpact,
  DecisionFramework,
  DecisionOption,
  DecisionRisk,
  DecisionTimeline,
  DecisionQuery,
  DecisionAnalysis,
  DecisionMetrics,
} from "./decision-engine";

export { EventBus } from "./event-bus";
export type {
  Event,
  EventPriority,
  EventStatus,
  EventSubscription,
  EventFilter,
  EventHandler,
  EventBusConfig,
  EventBusMetrics,
} from "./event-bus";

export { WorkflowEngine } from "./workflow-engine";
export type {
  Workflow,
  WorkflowStatus,
  WorkflowStep,
  StepStatus,
  StepType,
  StepConfig,
  RetryPolicy,
  WorkflowTrigger,
  WorkflowExecution,
  StepResult,
  WorkflowMetrics,
} from "./workflow-engine";

export { PlanningEngine } from "./planning-engine";
export type {
  Plan,
  PlanStatus,
  Goal,
  GoalStatus,
  GoalPriority,
  KPI,
  Milestone,
  Resource,
  ResourceType,
  PlanTimeline,
  PlanPhase,
  PlanningMetrics,
} from "./planning-engine";

export { ResearchEngine } from "./research-engine";
export type {
  Research,
  ResearchStatus,
  Finding,
  Evidence,
  Source,
  SourceType,
  EvidenceStrength,
  Recommendation,
  ResearchMetrics,
} from "./research-engine";

export { ReasoningEngine } from "./reasoning-engine";
export type {
  Reasoning,
  ReasoningType,
  ReasoningStatus,
  Premise,
  PremiseType,
  Conclusion,
  ReasoningStep,
  Alternative,
  LogicRule,
  ReasoningMetrics,
} from "./reasoning-engine";

export { SelfImprovementEngine } from "./self-improvement-engine";
export type {
  Improvement,
  ImprovementStatus,
  ImprovementType,
  ImprovementTrigger,
  ImprovementAction,
  ImprovementMetric,
  ImprovementOutcome,
  PerformanceSnapshot,
  SelfImprovementMetrics,
} from "./self-improvement-engine";

export { GovernanceEngine } from "./governance-engine";
export type {
  Policy,
  PolicyStatus,
  PolicyRule,
  ComplianceCheck,
  ComplianceStatus,
  ComplianceFinding,
  AuditEntry,
  AuditAction,
  ComplianceReport,
  GovernanceMetrics,
} from "./governance-engine";

export { KnowledgeGraph } from "./knowledge-graph";
export type {
  GraphNode,
  NodeType,
  GraphEdge,
  EdgeType,
  GraphPath,
  GraphQuery,
  GraphMetrics,
  Community,
} from "./knowledge-graph";

// ─── Engine Registry ─────────────────────────────────────────────────────────

import { MemoryEngine } from "./memory-engine";
import { DecisionEngine } from "./decision-engine";
import { EventBus } from "./event-bus";
import { WorkflowEngine } from "./workflow-engine";
import { PlanningEngine } from "./planning-engine";
import { ResearchEngine } from "./research-engine";
import { ReasoningEngine } from "./reasoning-engine";
import { SelfImprovementEngine } from "./self-improvement-engine";
import { GovernanceEngine } from "./governance-engine";
import { KnowledgeGraph } from "./knowledge-graph";

export interface EngineRegistry {
  memory: MemoryEngine;
  decision: DecisionEngine;
  eventBus: EventBus;
  workflow: WorkflowEngine;
  planning: PlanningEngine;
  research: ResearchEngine;
  reasoning: ReasoningEngine;
  selfImprovement: SelfImprovementEngine;
  governance: GovernanceEngine;
  knowledgeGraph: KnowledgeGraph;
}

/**
 * Create a complete engine registry with all engines initialized
 */
export function createEngineRegistry(): EngineRegistry {
  return {
    memory: new MemoryEngine(),
    decision: new DecisionEngine(),
    eventBus: new EventBus(),
    workflow: new WorkflowEngine(),
    planning: new PlanningEngine(),
    research: new ResearchEngine(),
    reasoning: new ReasoningEngine(),
    selfImprovement: new SelfImprovementEngine(),
    governance: new GovernanceEngine(),
    knowledgeGraph: new KnowledgeGraph(),
  };
}

export default createEngineRegistry;
