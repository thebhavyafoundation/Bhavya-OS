export type ReleaseStatus =
  | "published"
  | "approved"
  | "review"
  | "draft";

export type ReleaseType = "Major" | "Minor" | "Patch";

export interface Release {
  id: string;
  version: string;
  name: string;
  status: ReleaseStatus;
  date: string;
  type: ReleaseType;
  description: string;
  highlights: readonly string[];
}

export const releases: readonly Release[] = [
  {
    id: "REL-000",
    version: "v0.1",
    name: "Foundation Bootstrap",
    status: "published",
    date: "2026-07-15",
    type: "Major",
    description:
      "Monorepo architecture, build tools, core agent runtime, package conventions.",
    highlights: [
      "Monorepo with pnpm workspaces",
      "Package conventions and naming standards",
      "Core AI agent runtime prototypes",
      "Architecture Decision Records standard (ADR-0001)",
    ],
  },
  {
    id: "REL-001",
    version: "v0.2",
    name: "Platform Integration",
    status: "published",
    date: "2026-07-22",
    type: "Minor",
    description: "AI Gateway setup, OpenHuman workspace binding, provider abstraction.",
    highlights: [
      "Provider-agnostic AI Gateway abstraction layer (ADR-0002)",
      "OpenHuman workspace RPC integration",
      "Gateway health monitoring endpoint",
    ],
  },
  {
    id: "REL-002",
    version: "v0.3",
    name: "Institutional Runtime",
    status: "approved",
    date: "2026-07-22",
    type: "Major",
    description:
      "Schemas, memory governance, deterministic registry generator, agent profiles.",
    highlights: [
      "JSON validation schemas for all registry types",
      "Domain-owned memory system architecture",
      "Deterministic registry generator script",
      "AI agent profiles and registry",
      "Release management with versioned YAML manifests",
    ],
  },
  {
    id: "REL-003",
    version: "v0.4",
    name: "Institutional Knowledge Platform",
    status: "approved",
    date: "2026-07-22",
    type: "Minor",
    description:
      "Knowledge Graph, search index, link validator, public APIs, deterministic registry.",
    highlights: [
      "Bidirectional knowledge graph with 14 nodes",
      "Search index for standards and documents",
      "Link validator for cross-reference integrity",
      "Public API endpoints for registry data",
      "Deterministic registry generation protocol",
    ],
  },
  {
    id: "REL-004",
    version: "v0.5",
    name: "Mission Applications",
    status: "approved",
    date: "2026-07-23",
    type: "Minor",
    description:
      "Shared mission runtime, public website, application manifests, navigation registry.",
    highlights: [
      "Mission Runtime v0.5 with gateway, registry, memory, events, metadata, accessibility, observability",
      "Public website at apps/website with 7 pages",
      "Application manifest pattern for all 9 apps",
      "Navigation registry at navigation/public.json",
    ],
  },
  {
    id: "REL-006",
    version: "v0.6",
    name: "Public APIs & Integrations",
    status: "review",
    date: "2026-07-23",
    type: "Minor",
    description:
      "Mission Runtime expansion with 11 new service modules, SDK layer, capability contracts, and production website build.",
    highlights: [
      "Mission Runtime: auth, permissions, content, navigation, search, audit, documents, media, localization, notifications",
      "SDK scaffold: @bhavya/sdk with 5 module exports",
      "Capability contracts: CAP-001 Search",
      "Website: 21 static pages, transparency portal, SEO, i18n infrastructure",
    ],
  },
  {
    id: "REL-005",
    version: "v3.0",
    name: "Autonomous Execution",
    status: "approved",
    date: "2026-07-23",
    type: "Major",
    description:
      "Runtime freeze. CLI, planner, executor, orchestrator, API, metrics, compatibility testing, runtime snapshots. Stable platform for mission applications.",
    highlights: [
      "Runtime v3.0 declared stable and frozen",
      "CLI with 20+ commands across 11 groups",
      "Planner, executor, orchestrator subsystems",
      "Local HTTP API server on port 3100",
      "Compatibility testing and runtime snapshots",
      "Context optimizer with scored file selection",
    ],
  },
] as const;
