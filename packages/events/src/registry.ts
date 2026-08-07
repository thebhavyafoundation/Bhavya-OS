// Bhavya OS Event Registry — Canonical Event Categories

export type EventCategory =
  | "system"
  | "runtime"
  | "agent"
  | "workflow"
  | "knowledge"
  | "application"
  | "security"
  | "audit";

export interface EventDefinition {
  type: string;
  category: EventCategory;
  description: string;
  payloadSchema?: Record<string, unknown>;
  version: string;
}

// ─── Canonical Event Types ──────────────────────────────────────────

export const EVENT_DEFINITIONS: EventDefinition[] = [
  // System Events
  { type: "system:startup", category: "system", description: "Platform started", version: "1.0.0" },
  { type: "system:shutdown", category: "system", description: "Platform shutting down", version: "1.0.0" },
  { type: "system:error", category: "system", description: "System error occurred", version: "1.0.0" },
  { type: "system:health", category: "system", description: "Health check result", version: "1.0.0" },

  // Runtime Events
  { type: "runtime:engine:start", category: "runtime", description: "Engine started", version: "1.0.0" },
  { type: "runtime:engine:stop", category: "runtime", description: "Engine stopped", version: "1.0.0" },
  { type: "runtime:pipeline:start", category: "runtime", description: "Pipeline started", version: "1.0.0" },
  { type: "runtime:pipeline:complete", category: "runtime", description: "Pipeline completed", version: "1.0.0" },
  { type: "runtime:pipeline:error", category: "runtime", description: "Pipeline error", version: "1.0.0" },

  // Agent Events
  { type: "agent:created", category: "agent", description: "Agent created", version: "1.0.0" },
  { type: "agent:started", category: "agent", description: "Agent started", version: "1.0.0" },
  { type: "agent:stopped", category: "agent", description: "Agent stopped", version: "1.0.0" },
  { type: "agent:error", category: "agent", description: "Agent error", version: "1.0.0" },
  { type: "agent:task:assigned", category: "agent", description: "Task assigned to agent", version: "1.0.0" },
  { type: "agent:task:completed", category: "agent", description: "Agent completed task", version: "1.0.0" },

  // Workflow Events
  { type: "workflow:started", category: "workflow", description: "Workflow started", version: "1.0.0" },
  { type: "workflow:step:complete", category: "workflow", description: "Workflow step completed", version: "1.0.0" },
  { type: "workflow:complete", category: "workflow", description: "Workflow completed", version: "1.0.0" },
  { type: "workflow:error", category: "workflow", description: "Workflow error", version: "1.0.0" },
  { type: "workflow:paused", category: "workflow", description: "Workflow paused", version: "1.0.0" },
  { type: "workflow:resumed", category: "workflow", description: "Workflow resumed", version: "1.0.0" },

  // Knowledge Events
  { type: "knowledge:created", category: "knowledge", description: "Knowledge object created", version: "1.0.0" },
  { type: "knowledge:updated", category: "knowledge", description: "Knowledge object updated", version: "1.0.0" },
  { type: "knowledge:deleted", category: "knowledge", description: "Knowledge object deleted", version: "1.0.0" },
  { type: "knowledge:validated", category: "knowledge", description: "Knowledge validated", version: "1.0.0" },

  // Application Events
  { type: "app:installed", category: "application", description: "Application installed", version: "1.0.0" },
  { type: "app:started", category: "application", description: "Application started", version: "1.0.0" },
  { type: "app:stopped", category: "application", description: "Application stopped", version: "1.0.0" },
  { type: "app:error", category: "application", description: "Application error", version: "1.0.0" },

  // Security Events
  { type: "security:auth:success", category: "security", description: "Authentication successful", version: "1.0.0" },
  { type: "security:auth:failure", category: "security", description: "Authentication failed", version: "1.0.0" },
  { type: "security:permission:granted", category: "security", description: "Permission granted", version: "1.0.0" },
  { type: "security:permission:denied", category: "security", description: "Permission denied", version: "1.0.0" },
  { type: "security:violation", category: "security", description: "Security violation detected", version: "1.0.0" },

  // Audit Events
  { type: "audit:action", category: "audit", description: "Auditable action performed", version: "1.0.0" },
  { type: "audit:change", category: "audit", description: "Configuration change", version: "1.0.0" },
  { type: "audit:access", category: "audit", description: "Resource accessed", version: "1.0.0" },
];

// ─── Event Registry ─────────────────────────────────────────────────

export class EventRegistry {
  private definitions: Map<string, EventDefinition> = new Map();

  constructor() {
    for (const def of EVENT_DEFINITIONS) {
      this.definitions.set(def.type, def);
    }
  }

  get(type: string): EventDefinition | undefined {
    return this.definitions.get(type);
  }

  getByCategory(category: EventCategory): EventDefinition[] {
    return Array.from(this.definitions.values()).filter(
      (def) => def.category === category,
    );
  }

  list(): EventDefinition[] {
    return Array.from(this.definitions.values());
  }

  register(definition: EventDefinition): void {
    if (this.definitions.has(definition.type)) {
      throw new Error(`Event type ${definition.type} already registered`);
    }
    this.definitions.set(definition.type, definition);
  }
}
