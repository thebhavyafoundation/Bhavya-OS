// ═══════════════════════════════════════════════════
// BAR Generated Traceability System
// Generated: 2026-08-03T01:03:30.332Z
// ═══════════════════════════════════════════════════

export interface TraceResult {
  id: string;
  name: string;
  kind: string;
  direction: "upstream" | "downstream" | "related";
}

export interface FullTrace {
  id: string;
  upstream: TraceResult[];
  downstream: TraceResult[];
  related: TraceResult[];
}

// ─── Trace Chain ─────────────────────────────────
// From any implementation artifact, trace back to the
// institutional capability that justified its existence:
//
// Institution → Domain → Capability → Workflow → Skill →
// Agent → Service → Package → Application → UI Surface →
// Source Code → Test → Release
//
// Starting from a React component:
//   UI Surface → Application → Package → Service → Agent →
//   Skill → Workflow → Capability → Domain → Institution
//
// Starting from a capability:
//   Capability → Workflow → Skill → Agent → Service →
//   Package → Application → UI Surface

export const TRACE_CHAIN = [
  "institution",
  "domain",
  "capability",
  "workflow",
  "skill",
  "agent",
  "service",
  "package",
  "application",
  "ui-surface",
  "source-code",
  "test",
  "release",
] as const;

export type TraceChainLevel = (typeof TRACE_CHAIN)[number];

// ─── Cross-reference map ─────────────────────────
// Maps each entity kind to the kinds it references
export const CROSS_REFERENCES: Record<string, string[]> = {
  domain: ["capability"],
  capability: ["workflow", "skill", "event", "permission"],
  workflow: ["skill", "event"],
  skill: ["agent", "service"],
  agent: ["capability", "service"],
  service: ["package", "event"],
  package: ["application", "service"],
  application: ["ui-surface", "package"],
  "ui-surface": ["application", "capability"],
  event: ["capability", "domain"],
  permission: ["capability", "domain"],
};

// ─── Reverse cross-reference map ─────────────────
export const REVERSE_REFERENCES: Record<string, string[]> = {};
for (const [from, tos] of Object.entries(CROSS_REFERENCES)) {
  for (const to of tos) {
    if (!REVERSE_REFERENCES[to]) REVERSE_REFERENCES[to] = [];
    REVERSE_REFERENCES[to].push(from);
  }
}

// ─── Trace functions ─────────────────────────────

export function traceFromCapability(capabilityId: string): FullTrace {
  // This would be populated from the traceability report
  // In production, this would query the registry
  return { id: capabilityId, upstream: [], downstream: [], related: [] };
}

export function traceFromComponent(componentPath: string): FullTrace {
  // Trace from a React component back to its originating capability
  // 1. Find the UI Surface that owns this component
  // 2. Trace UI Surface → Application → Package → Service → Agent → Skill → Workflow → Capability
  return { id: componentPath, upstream: [], downstream: [], related: [] };
}

export function traceFromEndpoint(endpointPath: string): FullTrace {
  // Trace from an API endpoint back to its service and capability
  return { id: endpointPath, upstream: [], downstream: [], related: [] };
}

export function traceFromEvent(eventName: string): FullTrace {
  // Trace from an event to all capabilities that produce/consume it
  return { id: eventName, upstream: [], downstream: [], related: [] };
}

export function getCapabilityChain(capabilityId: string): TraceChainLevel[] {
  // Returns the full chain for a capability
  return [
    "institution",
    "domain",
    "capability",
    "workflow",
    "skill",
    "agent",
    "service",
    "package",
    "application",
    "ui-surface",
  ];
}
