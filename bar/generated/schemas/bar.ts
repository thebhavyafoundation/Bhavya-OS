// ═══════════════════════════════════════════════════
// BAR Generated Zod Schemas — Do not edit manually
// Generated: 2026-08-03T01:01:46.116Z
// ═══════════════════════════════════════════════════

import { z } from "zod";

// ─── Enums ───────────────────────────────────────

export const DomainEnum = z.enum([]);
export const EntityStatusEnum = z.enum([
  "proposed",
  "active",
  "deprecated",
  "archived",
]);
export const ImplementationStatusEnum = z.enum([
  "not-started",
  "in-progress",
  "implemented",
  "partial",
]);
export const AutomationLevelEnum = z.enum([
  "manual",
  "assisted",
  "semi-auto",
  "autonomous",
]);

// ─── Base Entity Schema ──────────────────────────

export const BarEntitySchema = z.object({
  id: z.string().regex(/^[A-Z]{2,4}-[A-Z0-9]{2,6}(-[a-z0-9-]+)?$/),
  name: z.string().min(3).max(120),
  kind: z.enum([
    "domain",
    "capability",
    "workflow",
    "skill",
    "agent",
    "service",
    "package",
    "application",
    "knowledge-object",
    "event",
    "permission",
    "ui-surface",
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  status: EntityStatusEnum,
  owner: z.string(),
  description: z.string().max(500),
  domain: z.string(),
  sourceAdr: z.string(),
  dependsOn: z.array(z.string()),
  upstream: z.array(z.string()),
  downstream: z.array(z.string()),
  related: z.array(z.string()),
  implementation: z.object({
    status: ImplementationStatusEnum,
    location: z.string(),
    files: z.array(z.string()),
  }),
  tests: z.object({
    status: z.enum(["none", "planned", "written", "passing"]),
    location: z.string().optional(),
  }),
  docs: z.object({
    status: z.enum(["none", "planned", "written", "published"]),
    location: z.string().optional(),
  }),
  release: z.string(),
  automation: AutomationLevelEnum,
  tags: z.array(z.string()),
  metadata: z.record(z.unknown()),
});

// ─── Capability Schema ───────────────────────────

export const CapabilityEntitySchema = BarEntitySchema.extend({
  kind: z.literal("capability"),
});

// ─── Workflow Schema ─────────────────────────────

export const WorkflowEntitySchema = BarEntitySchema.extend({
  kind: z.literal("workflow"),
});

// ─── Skill Schema ────────────────────────────────

export const SkillEntitySchema = BarEntitySchema.extend({
  kind: z.literal("skill"),
});

// ─── Agent Schema ────────────────────────────────

export const AgentEntitySchema = BarEntitySchema.extend({
  kind: z.literal("agent"),
  metadata: z.object({
    capabilities: z.array(z.string()),
  }),
});

// ─── Service Schema ──────────────────────────────

export const ServiceEntitySchema = BarEntitySchema.extend({
  kind: z.literal("service"),
  metadata: z.object({
    crossCutting: z.boolean(),
    usedBy: z.number().optional(),
  }),
});

// ─── Package Schema ──────────────────────────────

export const PackageEntitySchema = BarEntitySchema.extend({
  kind: z.literal("package"),
});

// ─── Application Schema ──────────────────────────

export const ApplicationEntitySchema = BarEntitySchema.extend({
  kind: z.literal("application"),
});

// ─── Event Schema ────────────────────────────────

export const EventEntitySchema = BarEntitySchema.extend({
  kind: z.literal("event"),
});

// ─── Permission Schema ───────────────────────────

export const PermissionEntitySchema = BarEntitySchema.extend({
  kind: z.literal("permission"),
  metadata: z.object({
    group: z.string(),
    action: z.string(),
  }),
});

// ─── Knowledge Object Schema ─────────────────────

export const KnowledgeObjectEntitySchema = BarEntitySchema.extend({
  kind: z.literal("knowledge-object"),
});

// ─── UI Surface Schema ───────────────────────────

export const UiSurfaceEntitySchema = BarEntitySchema.extend({
  kind: z.literal("ui-surface"),
});

// ─── Validation Helpers ──────────────────────────

export function validateEntity(data: unknown) {
  return BarEntitySchema.safeParse(data);
}

export function validateCapability(data: unknown) {
  return CapabilityEntitySchema.safeParse(data);
}

export function validateAgent(data: unknown) {
  return AgentEntitySchema.safeParse(data);
}

export function validateService(data: unknown) {
  return ServiceEntitySchema.safeParse(data);
}

export function validateWorkflow(data: unknown) {
  return WorkflowEntitySchema.safeParse(data);
}
