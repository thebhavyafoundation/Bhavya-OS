// ═══════════════════════════════════════════════════
// BAR Generated Types — Do not edit manually
// Generated: 2026-08-03T01:01:46.103Z
// Source: bar/registries
// ═══════════════════════════════════════════════════

// ─── Enums ───────────────────────────────────────

export enum Domain {}

export enum EntityKind {
  Domain = "domain",
  Capability = "capability",
  Workflow = "workflow",
  Skill = "skill",
  Agent = "agent",
  Service = "service",
  Package = "package",
  Application = "application",
  KnowledgeObject = "knowledge-object",
  Event = "event",
  Permission = "permission",
  UiSurface = "ui-surface",
}

export enum EntityStatus {
  Proposed = "proposed",
  Active = "active",
  Deprecated = "deprecated",
  Archived = "archived",
}

export enum ImplementationStatus {
  NotStarted = "not-started",
  InProgress = "in-progress",
  Implemented = "implemented",
  Partial = "partial",
}

export enum AutomationLevel {
  Manual = "manual",
  Assisted = "assisted",
  SemiAuto = "semi-auto",
  Autonomous = "autonomous",
}

export enum PermissionGroup {
  Assessment = "assessment",
  Budget = "budget",
  Community = "community",
  Compliance = "compliance",
  Contract = "contract",
  Curriculum = "curriculum",
  Finance = "finance",
  Grant = "grant",
  Knowledge = "knowledge",
  Lesson = "lesson",
  Media = "media",
  Partner = "partner",
  Publication = "publication",
  Report = "report",
  Research = "research",
  Staff = "staff",
  Student = "student",
  System = "system",
  User = "user",
  Volunteer = "volunteer",
}

// ─── Constants ────────────────────────────────────

export const DOMAIN_NAMES: Record<Domain, string> = {};

// ─── Base Entity ──────────────────────────────────

export interface BarEntity {
  id: string;
  name: string;
  kind: EntityKind;
  version: string;
  status: EntityStatus;
  owner: string;
  description: string;
  domain: string;
  sourceAdr: string;
  dependsOn: string[];
  upstream: string[];
  downstream: string[];
  related: string[];
  implementation: {
    status: ImplementationStatus;
    location: string;
    files: string[];
  };
  tests: {
    status: "none" | "planned" | "written" | "passing";
    location?: string;
  };
  docs: {
    status: "none" | "planned" | "written" | "published";
    location?: string;
  };
  release: string;
  automation: AutomationLevel;
  tags: string[];
  metadata: Record<string, unknown>;
}

// ─── Capability ID Types ─────────────────────────

export type D01CapabilityId =
  | "D01-C01"
  | "D01-C02"
  | "D01-C03"
  | "D01-C04"
  | "D01-C05"
  | "D01-C06"
  | "D01-C07"
  | "D01-C08"
  | "D01-C09";

export type D02CapabilityId =
  | "D02-C01"
  | "D02-C02"
  | "D02-C03"
  | "D02-C04"
  | "D02-C05"
  | "D02-C06"
  | "D02-C07"
  | "D02-C08"
  | "D02-C09"
  | "D02-C10";

export type D03CapabilityId =
  | "D03-C01"
  | "D03-C02"
  | "D03-C03"
  | "D03-C04"
  | "D03-C05"
  | "D03-C06"
  | "D03-C07"
  | "D03-C08"
  | "D03-C09"
  | "D03-C10"
  | "D03-C11";

export type D04CapabilityId =
  | "D04-C01"
  | "D04-C02"
  | "D04-C03"
  | "D04-C04"
  | "D04-C05"
  | "D04-C06"
  | "D04-C07"
  | "D04-C08";

export type D05CapabilityId =
  | "D05-C01"
  | "D05-C02"
  | "D05-C03"
  | "D05-C04"
  | "D05-C05"
  | "D05-C06"
  | "D05-C07"
  | "D05-C08"
  | "D05-C09";

export type D06CapabilityId =
  | "D06-C01"
  | "D06-C02"
  | "D06-C03"
  | "D06-C04"
  | "D06-C05"
  | "D06-C06"
  | "D06-C07";

export type D07CapabilityId =
  "D07-C01" | "D07-C02" | "D07-C03" | "D07-C04" | "D07-C05" | "D07-C06";

export type D08CapabilityId =
  | "D08-C01"
  | "D08-C02"
  | "D08-C03"
  | "D08-C04"
  | "D08-C05"
  | "D08-C06"
  | "D08-C07"
  | "D08-C08"
  | "D08-C09";

export type D09CapabilityId =
  | "D09-C01"
  | "D09-C02"
  | "D09-C03"
  | "D09-C04"
  | "D09-C05"
  | "D09-C06"
  | "D09-C07"
  | "D09-C08";

export type D10CapabilityId =
  | "D10-C01"
  | "D10-C02"
  | "D10-C03"
  | "D10-C04"
  | "D10-C05"
  | "D10-C06"
  | "D10-C07";

export type D11CapabilityId =
  | "D11-C01"
  | "D11-C02"
  | "D11-C03"
  | "D11-C04"
  | "D11-C05"
  | "D11-C06"
  | "D11-C07"
  | "D11-C08"
  | "D11-C09";

export type D12CapabilityId =
  | "D12-C01"
  | "D12-C02"
  | "D12-C03"
  | "D12-C04"
  | "D12-C05"
  | "D12-C06"
  | "D12-C07";

export type D13CapabilityId =
  | "D13-C01"
  | "D13-C02"
  | "D13-C03"
  | "D13-C04"
  | "D13-C05"
  | "D13-C06"
  | "D13-C07"
  | "D13-C08";

export type D14CapabilityId =
  | "D14-C01"
  | "D14-C02"
  | "D14-C03"
  | "D14-C04"
  | "D14-C05"
  | "D14-C06"
  | "D14-C07"
  | "D14-C08";

export type D15CapabilityId =
  | "D15-C01"
  | "D15-C02"
  | "D15-C03"
  | "D15-C04"
  | "D15-C05"
  | "D15-C06"
  | "D15-C07";

export type D16CapabilityId =
  | "D16-C01"
  | "D16-C02"
  | "D16-C03"
  | "D16-C04"
  | "D16-C05"
  | "D16-C06"
  | "D16-C07";

export type D17CapabilityId =
  | "D17-C01"
  | "D17-C02"
  | "D17-C03"
  | "D17-C04"
  | "D17-C05"
  | "D17-C06"
  | "D17-C07"
  | "D17-C08";

export type D18CapabilityId =
  | "D18-C01"
  | "D18-C02"
  | "D18-C03"
  | "D18-C04"
  | "D18-C05"
  | "D18-C06"
  | "D18-C07";

export type D19CapabilityId =
  "D19-C01" | "D19-C02" | "D19-C03" | "D19-C04" | "D19-C05" | "D19-C06";

export type D20CapabilityId =
  "D20-C01" | "D20-C02" | "D20-C03" | "D20-C04" | "D20-C05" | "D20-C06";

export type D21CapabilityId =
  "D21-C01" | "D21-C02" | "D21-C03" | "D21-C04" | "D21-C05";

// ─── Event Name Types ────────────────────────────

export type D02EventName =
  | "student.admitted"
  | "student.enrolled"
  | "staff.hired"
  | "attendance.recorded"
  | "announcement.published"
  | "event.created";

export type D16EventName =
  | "model.trained"
  | "model.deployed"
  | "content.generated"
  | "recommendation.made"
  | "rag.query";

export type D18EventName =
  "metric.recorded" | "dashboard.refreshed" | "report.generated";

export type D09EventName =
  "member.joined" | "post.created" | "comment.added" | "feedback.submitted";

export type D13EventName =
  | "audit.started"
  | "audit.completed"
  | "violation.detected"
  | "violation.resolved"
  | "policy.updated"
  | "compliance-report.generated";

export type D03EventName =
  | "lesson.generated"
  | "lesson.published"
  | "assessment.generated"
  | "assessment.submitted"
  | "assessment.graded"
  | "grade.posted"
  | "progress.updated"
  | "curriculum.published"
  | "certificate.issued"
  | "enrollment.completed";

export type D17EventName =
  | "deploy.started"
  | "deploy.completed"
  | "deploy.failed"
  | "build.succeeded"
  | "build.failed"
  | "test.passed"
  | "test.failed";

export type D11EventName =
  | "budget.created"
  | "budget.approved"
  | "expense.recorded"
  | "payment.processed"
  | "invoice.received"
  | "payroll.processed"
  | "grant.received"
  | "financial-report.generated"
  | "donation.received";

export type D01EventName =
  "policy.enacted" | "decision.recorded" | "board-meeting.completed";

export type D15EventName =
  | "alert.triggered"
  | "alert.resolved"
  | "backup.completed"
  | "scaling.triggered";

export type D05EventName =
  | "ko.created"
  | "ko.updated"
  | "ko.published"
  | "ko.deleted"
  | "ko.validated"
  | "ko.versioned"
  | "kg.edge-added"
  | "kg.edge-removed"
  | "kg.node-added"
  | "ingestion.completed";

export type D08EventName =
  | "video.generated"
  | "website.generated"
  | "slides.generated"
  | "content.published"
  | "content.distributed";

export type D14EventName =
  | "workflow.started"
  | "workflow.completed"
  | "workflow.failed"
  | "task.created"
  | "task.assigned"
  | "task.completed"
  | "incident.detected"
  | "incident.resolved"
  | "sla.breached"
  | "change.deployed";

export type D04EventName =
  | "proposal.submitted"
  | "proposal.approved"
  | "paper.submitted"
  | "paper.published";

export type D10EventName =
  | "volunteer.applied"
  | "volunteer.approved"
  | "hours.logged"
  | "task.completed";

// ─── Specific Entity Types ───────────────────────

export interface DomainEntity extends BarEntity {
  kind: EntityKind.Domain;
  metadata: {
    capabilityCount: number;
    depth: number;
  };
}

export interface CapabilityEntity extends BarEntity {
  kind: EntityKind.Capability;
}

export interface WorkflowEntity extends BarEntity {
  kind: EntityKind.Workflow;
}

export interface SkillEntity extends BarEntity {
  kind: EntityKind.Skill;
}

export interface AgentEntity extends BarEntity {
  kind: EntityKind.Agent;
  metadata: {
    capabilities: string[];
  };
}

export interface ServiceEntity extends BarEntity {
  kind: EntityKind.Service;
  metadata: {
    crossCutting: boolean;
    usedBy?: number;
  };
}

export interface PackageEntity extends BarEntity {
  kind: EntityKind.Package;
}

export interface ApplicationEntity extends BarEntity {
  kind: EntityKind.Application;
}

export interface KnowledgeObjectEntity extends BarEntity {
  kind: EntityKind.KnowledgeObject;
}

export interface EventEntity extends BarEntity {
  kind: EntityKind.Event;
}

export interface PermissionEntity extends BarEntity {
  kind: EntityKind.Permission;
  metadata: {
    group: string;
    action: string;
  };
}

export interface UiSurfaceEntity extends BarEntity {
  kind: EntityKind.UiSurface;
}

// ─── Registry Index ──────────────────────────────

export interface RegistryIndex {
  registryVersion: string;
  generatedAt: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    domain: string;
    status: string;
    impl: string;
  }>;
}

// ─── Type Helpers ────────────────────────────────

export type CapabilityId =
  | "D01-C01"
  | "D01-C02"
  | "D01-C03"
  | "D01-C04"
  | "D01-C05"
  | "D01-C06"
  | "D01-C07"
  | "D01-C08"
  | "D01-C09"
  | "D02-C01"
  | "D02-C02"
  | "D02-C03"
  | "D02-C04"
  | "D02-C05"
  | "D02-C06"
  | "D02-C07"
  | "D02-C08"
  | "D02-C09"
  | "D02-C10"
  | "D03-C01"
  | "D03-C02"
  | "D03-C03"
  | "D03-C04"
  | "D03-C05"
  | "D03-C06"
  | "D03-C07"
  | "D03-C08"
  | "D03-C09"
  | "D03-C10"
  | "D03-C11"
  | "D04-C01"
  | "D04-C02"
  | "D04-C03"
  | "D04-C04"
  | "D04-C05"
  | "D04-C06"
  | "D04-C07"
  | "D04-C08"
  | "D05-C01"
  | "D05-C02"
  | "D05-C03"
  | "D05-C04"
  | "D05-C05"
  | "D05-C06"
  | "D05-C07"
  | "D05-C08"
  | "D05-C09"
  | "D06-C01"
  | "D06-C02"
  | "D06-C03"
  | "D06-C04"
  | "D06-C05"
  | "D06-C06"
  | "D06-C07"
  | "D07-C01"
  | "D07-C02"
  | "D07-C03"
  | "D07-C04"
  | "D07-C05"
  | "D07-C06"
  | "D08-C01"
  | "D08-C02"
  | "D08-C03"
  | "D08-C04"
  | "D08-C05"
  | "D08-C06"
  | "D08-C07"
  | "D08-C08"
  | "D08-C09"
  | "D09-C01"
  | "D09-C02"
  | "D09-C03"
  | "D09-C04"
  | "D09-C05"
  | "D09-C06"
  | "D09-C07"
  | "D09-C08"
  | "D10-C01"
  | "D10-C02"
  | "D10-C03"
  | "D10-C04"
  | "D10-C05"
  | "D10-C06"
  | "D10-C07"
  | "D11-C01"
  | "D11-C02"
  | "D11-C03"
  | "D11-C04"
  | "D11-C05"
  | "D11-C06"
  | "D11-C07"
  | "D11-C08"
  | "D11-C09"
  | "D12-C01"
  | "D12-C02"
  | "D12-C03"
  | "D12-C04"
  | "D12-C05"
  | "D12-C06"
  | "D12-C07"
  | "D13-C01"
  | "D13-C02"
  | "D13-C03"
  | "D13-C04"
  | "D13-C05"
  | "D13-C06"
  | "D13-C07"
  | "D13-C08"
  | "D14-C01"
  | "D14-C02"
  | "D14-C03"
  | "D14-C04"
  | "D14-C05"
  | "D14-C06"
  | "D14-C07"
  | "D14-C08"
  | "D15-C01"
  | "D15-C02"
  | "D15-C03"
  | "D15-C04"
  | "D15-C05"
  | "D15-C06"
  | "D15-C07"
  | "D16-C01"
  | "D16-C02"
  | "D16-C03"
  | "D16-C04"
  | "D16-C05"
  | "D16-C06"
  | "D16-C07"
  | "D17-C01"
  | "D17-C02"
  | "D17-C03"
  | "D17-C04"
  | "D17-C05"
  | "D17-C06"
  | "D17-C07"
  | "D17-C08"
  | "D18-C01"
  | "D18-C02"
  | "D18-C03"
  | "D18-C04"
  | "D18-C05"
  | "D18-C06"
  | "D18-C07"
  | "D19-C01"
  | "D19-C02"
  | "D19-C03"
  | "D19-C04"
  | "D19-C05"
  | "D19-C06"
  | "D20-C01"
  | "D20-C02"
  | "D20-C03"
  | "D20-C04"
  | "D20-C05"
  | "D20-C06"
  | "D21-C01"
  | "D21-C02"
  | "D21-C03"
  | "D21-C04"
  | "D21-C05";
export type WorkflowId =
  | "WF-001"
  | "WF-002"
  | "WF-003"
  | "WF-004"
  | "WF-005"
  | "WF-006"
  | "WF-007"
  | "WF-008"
  | "WF-009"
  | "WF-010"
  | "WF-011"
  | "WF-012"
  | "WF-013"
  | "WF-014"
  | "WF-015"
  | "WF-016"
  | "WF-017"
  | "WF-018"
  | "WF-019"
  | "WF-020";
export type SkillId =
  | "SK-L1-001"
  | "SK-L1-002"
  | "SK-L1-003"
  | "SK-L1-004"
  | "SK-L1-005"
  | "SK-L1-006"
  | "SK-L1-007"
  | "SK-L2-001"
  | "SK-L2-002"
  | "SK-L2-003"
  | "SK-L2-004"
  | "SK-L2-005"
  | "SK-L3-001"
  | "SK-L3-002"
  | "SK-L3-003"
  | "SK-L4-001"
  | "SK-L4-002"
  | "SK-L4-003"
  | "SK-L4-004"
  | "SK-L4-005"
  | "SK-L4-006"
  | "SK-L5-001"
  | "SK-L5-002"
  | "SK-L5-003"
  | "SK-L6-001"
  | "SK-L6-002"
  | "SK-L7-001"
  | "SK-L7-002"
  | "SK-L7-003"
  | "SK-L7-004"
  | "SK-L7-005"
  | "SK-L8-001"
  | "SK-L8-002"
  | "SK-L8-003"
  | "SK-L9-001"
  | "SK-L9-002";
export type AgentId =
  | "AG-AI-001"
  | "AG-AN-001"
  | "AG-COM-001"
  | "AG-EDU-001"
  | "AG-EDU-002"
  | "AG-EDU-003"
  | "AG-EDU-004"
  | "AG-ENG-001"
  | "AG-GOV-001"
  | "AG-INF-001"
  | "AG-KM-001"
  | "AG-MEDIA-001"
  | "AG-OPS-001"
  | "AG-OPS-002"
  | "AG-OPS-003"
  | "AG-OPS-004"
  | "AG-OPS-005"
  | "AG-OUT-001"
  | "AG-PART-001"
  | "AG-PUB-001"
  | "AG-SUS-001"
  | "AG-VOL-001";
export type ServiceId =
  | "SV-CORE-001"
  | "SV-CORE-002"
  | "SV-CORE-003"
  | "SV-CORE-004"
  | "SV-CORE-005"
  | "SV-CORE-006"
  | "SV-CORE-007"
  | "SV-CORE-008"
  | "SV-CORE-009"
  | "SV-CORE-010"
  | "SV-D03-001"
  | "SV-D03-002"
  | "SV-D03-003"
  | "SV-D05-001"
  | "SV-D05-002"
  | "SV-D08-001"
  | "SV-D08-002"
  | "SV-D08-003"
  | "SV-D11-001"
  | "SV-D13-001"
  | "SV-D14-001"
  | "SV-D15-001"
  | "SV-D16-001"
  | "SV-D17-001"
  | "SV-D17-002";
export type PackageId =
  | "PK-001"
  | "PK-002"
  | "PK-003"
  | "PK-004"
  | "PK-005"
  | "PK-006"
  | "PK-007"
  | "PK-008"
  | "PK-009"
  | "PK-010"
  | "PK-011"
  | "PK-012"
  | "PK-013"
  | "PK-014"
  | "PK-015"
  | "PK-016"
  | "PK-017";
export type ApplicationId =
  | "APP-001"
  | "APP-002"
  | "APP-003"
  | "APP-004"
  | "APP-005"
  | "APP-006"
  | "APP-007"
  | "APP-008"
  | "APP-009"
  | "APP-010"
  | "APP-011"
  | "APP-012"
  | "APP-013"
  | "APP-014"
  | "APP-015"
  | "APP-016"
  | "APP-017"
  | "APP-018";
export type EventName =
  | "student.admitted"
  | "student.enrolled"
  | "staff.hired"
  | "attendance.recorded"
  | "announcement.published"
  | "event.created"
  | "model.trained"
  | "model.deployed"
  | "content.generated"
  | "recommendation.made"
  | "rag.query"
  | "metric.recorded"
  | "dashboard.refreshed"
  | "report.generated"
  | "member.joined"
  | "post.created"
  | "comment.added"
  | "feedback.submitted"
  | "audit.started"
  | "audit.completed"
  | "violation.detected"
  | "violation.resolved"
  | "policy.updated"
  | "compliance-report.generated"
  | "lesson.generated"
  | "lesson.published"
  | "assessment.generated"
  | "assessment.submitted"
  | "assessment.graded"
  | "grade.posted"
  | "progress.updated"
  | "curriculum.published"
  | "certificate.issued"
  | "enrollment.completed"
  | "deploy.started"
  | "deploy.completed"
  | "deploy.failed"
  | "build.succeeded"
  | "build.failed"
  | "test.passed"
  | "test.failed"
  | "budget.created"
  | "budget.approved"
  | "expense.recorded"
  | "payment.processed"
  | "invoice.received"
  | "payroll.processed"
  | "grant.received"
  | "financial-report.generated"
  | "donation.received"
  | "policy.enacted"
  | "decision.recorded"
  | "board-meeting.completed"
  | "alert.triggered"
  | "alert.resolved"
  | "backup.completed"
  | "scaling.triggered"
  | "ko.created"
  | "ko.updated"
  | "ko.published"
  | "ko.deleted"
  | "ko.validated"
  | "ko.versioned"
  | "kg.edge-added"
  | "kg.edge-removed"
  | "kg.node-added"
  | "ingestion.completed"
  | "video.generated"
  | "website.generated"
  | "slides.generated"
  | "content.published"
  | "content.distributed"
  | "workflow.started"
  | "workflow.completed"
  | "workflow.failed"
  | "task.created"
  | "task.assigned"
  | "task.completed"
  | "incident.detected"
  | "incident.resolved"
  | "sla.breached"
  | "change.deployed"
  | "proposal.submitted"
  | "proposal.approved"
  | "paper.submitted"
  | "paper.published"
  | "volunteer.applied"
  | "volunteer.approved"
  | "hours.logged"
  | "task.completed";
export type PermissionId =
  | "PM-ASSE-CREATE"
  | "PM-ASSE-DELETE"
  | "PM-ASSE-GRADE"
  | "PM-ASSE-PUBLISH"
  | "PM-ASSE-READ"
  | "PM-ASSE-REVIEW"
  | "PM-ASSE-SUBMIT"
  | "PM-ASSE-UPDATE"
  | "PM-BUDG-APPROVE"
  | "PM-BUDG-CREATE"
  | "PM-BUDG-DELETE"
  | "PM-BUDG-READ"
  | "PM-BUDG-UPDATE"
  | "PM-COMM-BAN"
  | "PM-COMM-CREATE"
  | "PM-COMM-DELETE"
  | "PM-COMM-MODERATE"
  | "PM-COMM-READ"
  | "PM-COMM-UPDATE"
  | "PM-COMP-AUDIT"
  | "PM-COMP-CREATE"
  | "PM-COMP-DELETE"
  | "PM-COMP-ENFORCE"
  | "PM-COMP-READ"
  | "PM-COMP-REPORT"
  | "PM-COMP-UPDATE"
  | "PM-CONT-APPROVE"
  | "PM-CONT-CREATE"
  | "PM-CONT-DELETE"
  | "PM-CONT-READ"
  | "PM-CONT-RENEW"
  | "PM-CONT-SIGN"
  | "PM-CONT-UPDATE"
  | "PM-CURR-APPROVE"
  | "PM-CURR-CREATE"
  | "PM-CURR-DELETE"
  | "PM-CURR-PUBLISH"
  | "PM-CURR-READ"
  | "PM-CURR-UPDATE"
  | "PM-FINA-APPROVE"
  | "PM-FINA-CREATE"
  | "PM-FINA-DELETE"
  | "PM-FINA-EXPORT"
  | "PM-FINA-READ"
  | "PM-FINA-REJECT"
  | "PM-FINA-UPDATE"
  | "PM-GRAN-APPLY"
  | "PM-GRAN-CREATE"
  | "PM-GRAN-DELETE"
  | "PM-GRAN-READ"
  | "PM-GRAN-REPORT"
  | "PM-GRAN-UPDATE"
  | "PM-KNOW-CREATE"
  | "PM-KNOW-DELETE"
  | "PM-KNOW-GRAPH-MA"
  | "PM-KNOW-INGEST"
  | "PM-KNOW-PUBLISH"
  | "PM-KNOW-READ"
  | "PM-KNOW-SEARCH"
  | "PM-KNOW-UPDATE"
  | "PM-KNOW-VALIDATE"
  | "PM-KNOW-VERSION"
  | "PM-LESS-ASSIGN"
  | "PM-LESS-CREATE"
  | "PM-LESS-DELETE"
  | "PM-LESS-GENERATE"
  | "PM-LESS-GRADE"
  | "PM-LESS-PUBLISH"
  | "PM-LESS-READ"
  | "PM-LESS-UPDATE"
  | "PM-MEDI-CREATE"
  | "PM-MEDI-DELETE"
  | "PM-MEDI-DISTRIBU"
  | "PM-MEDI-PUBLISH"
  | "PM-MEDI-READ"
  | "PM-MEDI-UPDATE"
  | "PM-PART-ACTIVATE"
  | "PM-PART-CREATE"
  | "PM-PART-DELETE"
  | "PM-PART-READ"
  | "PM-PART-UPDATE"
  | "PM-PUBL-CREATE"
  | "PM-PUBL-DELETE"
  | "PM-PUBL-PUBLISH"
  | "PM-PUBL-READ"
  | "PM-PUBL-REVIEW"
  | "PM-PUBL-UPDATE"
  | "PM-REPO-CREATE"
  | "PM-REPO-EXPORT"
  | "PM-REPO-READ"
  | "PM-REPO-SCHEDULE"
  | "PM-RESE-APPROVE"
  | "PM-RESE-CREATE"
  | "PM-RESE-DELETE"
  | "PM-RESE-READ"
  | "PM-RESE-SUBMIT"
  | "PM-RESE-UPDATE"
  | "PM-STAF-CREATE"
  | "PM-STAF-DELETE"
  | "PM-STAF-HIRE"
  | "PM-STAF-PROMOTE"
  | "PM-STAF-READ"
  | "PM-STAF-TERMINAT"
  | "PM-STAF-UPDATE"
  | "PM-STUD-CREATE"
  | "PM-STUD-DELETE"
  | "PM-STUD-ENROLL"
  | "PM-STUD-GRADUATE"
  | "PM-STUD-READ"
  | "PM-STUD-SUSPEND"
  | "PM-STUD-TRANSFER"
  | "PM-STUD-UPDATE"
  | "PM-SYST-ADMIN"
  | "PM-SYST-BACKUP"
  | "PM-SYST-CONFIGUR"
  | "PM-SYST-DEPLOY"
  | "PM-SYST-MONITOR"
  | "PM-SYST-RESTORE"
  | "PM-USER-CREATE"
  | "PM-USER-DELETE"
  | "PM-USER-READ"
  | "PM-USER-ROLE-ASS"
  | "PM-USER-SUSPEND"
  | "PM-USER-UPDATE"
  | "PM-VOLU-APPROVE"
  | "PM-VOLU-ASSIGN"
  | "PM-VOLU-CREATE"
  | "PM-VOLU-DELETE"
  | "PM-VOLU-LOG-HOUR"
  | "PM-VOLU-READ"
  | "PM-VOLU-UPDATE";
export type KoTypeId =
  | "KO-ASSESSMENT"
  | "KO-COMPLIANCE"
  | "KO-CONCEPT"
  | "KO-CONTRACT"
  | "KO-CURRICULUM"
  | "KO-EVENT"
  | "KO-EXAMPLE"
  | "KO-EXERCISE"
  | "KO-FINANCIAL"
  | "KO-GRANT"
  | "KO-LEGAL"
  | "KO-LESSON"
  | "KO-MEDIA"
  | "KO-MISCONCEPTION"
  | "KO-POLICY"
  | "KO-REPORT"
  | "KO-RESEARCH"
  | "KO-STAFF"
  | "KO-STUDENT"
  | "KO-VOCABULARY";
export type UiSurfaceId =
  | "UI-ADM-001"
  | "UI-ADM-002"
  | "UI-ADM-003"
  | "UI-ADM-004"
  | "UI-ADM-005"
  | "UI-ADM-006"
  | "UI-API-001"
  | "UI-API-002"
  | "UI-CMP-001"
  | "UI-CMP-002"
  | "UI-CMP-003"
  | "UI-CMP-004"
  | "UI-CMT-001"
  | "UI-CMT-002"
  | "UI-CMT-003"
  | "UI-CMT-004"
  | "UI-CMT-005"
  | "UI-DASH-001"
  | "UI-DASH-002"
  | "UI-DASH-003"
  | "UI-DASH-004"
  | "UI-DASH-005"
  | "UI-DOC-001"
  | "UI-DOC-002"
  | "UI-DOC-003"
  | "UI-DS-001"
  | "UI-DS-002"
  | "UI-DS-003"
  | "UI-FIN-001"
  | "UI-FIN-002"
  | "UI-FIN-003"
  | "UI-FIN-004"
  | "UI-FIN-005"
  | "UI-FIN-006"
  | "UI-HER-001"
  | "UI-HER-002"
  | "UI-KP-001"
  | "UI-KP-002"
  | "UI-KP-003"
  | "UI-KP-004"
  | "UI-LAB-001"
  | "UI-LAB-002"
  | "UI-LAB-003"
  | "UI-LAB-004"
  | "UI-LAB-005"
  | "UI-LAB-006"
  | "UI-LAB-007"
  | "UI-LAB-008"
  | "UI-LAB-009"
  | "UI-LAB-010"
  | "UI-LAB-011"
  | "UI-LAB-012"
  | "UI-LAB-013"
  | "UI-LAB-014"
  | "UI-LIB-001"
  | "UI-LIB-002"
  | "UI-LIB-003"
  | "UI-LS-001"
  | "UI-LS-002"
  | "UI-LS-003"
  | "UI-LS-004"
  | "UI-LS-005"
  | "UI-LS-006"
  | "UI-MON-001"
  | "UI-MON-002"
  | "UI-MON-003"
  | "UI-RES-001"
  | "UI-RES-002"
  | "UI-RES-003"
  | "UI-RES-004"
  | "UI-TRN-001"
  | "UI-TRN-002"
  | "UI-TRN-003"
  | "UI-VOL-001"
  | "UI-VOL-002"
  | "UI-VOL-003"
  | "UI-VOL-004";
