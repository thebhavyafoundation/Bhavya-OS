// ─── Capability Types ──────────────────────────────────────────────────────
// Every discovered technology becomes a Capability.

export type CapabilityType =
  | "mcp_server"
  | "cli_tool"
  | "browser_automation"
  | "plugin"
  | "github_action"
  | "docker_service"
  | "node_package"
  | "python_package"
  | "rust_tool"
  | "go_binary"
  | "web_service"
  | "ai_model"
  | "dataset"
  | "course"
  | "documentation";

export type CapabilityStatus =
  "active" | "deprecated" | "experimental" | "archived";

export interface Capability {
  id: string;
  name: string;
  type: CapabilityType;
  category: string;
  description: string;

  // Links
  repository: string | null;
  website: string | null;
  documentation: string | null;
  license: string | null;

  // Technical
  language: string | null;
  dependencies: string[];
  systemRequirements: string[];
  resourceUsage: "low" | "medium" | "high";

  // Availability
  offlineSupport: boolean;
  cloudSupport: boolean;
  apiRequired: boolean;
  authentication: "none" | "api_key" | "oauth" | "token";

  // Integration
  browserAutomationPossible: boolean;
  cliAvailable: boolean;
  mcpAvailable: boolean;
  dockerAvailable: boolean;
  githubActionAvailable: boolean;
  platformSupport: string[];

  // Metadata
  status: CapabilityStatus;
  version: string | null;
  updateFrequency: string | null;
  maintainer: string | null;

  // Community
  stars: number;
  downloads: number;
  openIssues: number;
  lastCommit: string | null;

  // Scoring
  scores: CapabilityScores;
  bhavyaScore: number; // 0-100, composite

  // Tracking
  discoveredAt: string;
  updatedAt: string;
  versionHistory: VersionEntry[];
}

export interface VersionEntry {
  version: string;
  date: string;
  changelog: string;
}

// ─── Capability Scores ─────────────────────────────────────────────────────

export interface CapabilityScores {
  performance: number; // 0-10
  easeOfIntegration: number; // 0-10
  maintenance: number; // 0-10
  community: number; // 0-10
  security: number; // 0-10
  offlineCapability: number; // 0-10
  cloudCapability: number; // 0-10
  resourceUsage: number; // 0-10 (higher = better, i.e. lower usage)
  educationalValue: number; // 0-10
  futureProof: number; // 0-10
  vendorLockin: number; // 0-10 (higher = less lock-in)
  openSourceHealth: number; // 0-10
}

// ─── Recommendation ────────────────────────────────────────────────────────

export type RecommendationLevel =
  | "install_immediately"
  | "pilot"
  | "study"
  | "reference"
  | "monitor"
  | "archive"
  | "ignore";

export interface CapabilityRecommendation {
  capabilityId: string;
  level: RecommendationLevel;
  reasoning: string;
  useCases: string[];
  alternatives: string[];
  integrationNotes: string;
  recommendedAt: string;
}

// ─── Provider Interface ────────────────────────────────────────────────────
// Every integration uses a provider interface.
// Adding a new capability type = implementing a provider.

export interface CapabilityProvider {
  readonly type: CapabilityType;
  discover(): Promise<Partial<Capability>[]>;
  evaluate(capability: Capability): Promise<CapabilityScores>;
  canIntegrate(capability: Capability): IntegrationCheck;
  getInstallation(capability: Capability): InstallationGuide;
}

export interface IntegrationCheck {
  possible: boolean;
  method: "mcp" | "cli" | "browser" | "api" | "docker" | "action" | "none";
  notes: string;
}

export interface InstallationGuide {
  steps: string[];
  prerequisites: string[];
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
}

// ─── Registry State ────────────────────────────────────────────────────────

export interface RegistryState {
  capabilities: Map<string, Capability>;
  lastUpdated: string;
  totalCount: number;
  typeBreakdown: Record<CapabilityType, number>;
  statusBreakdown: Record<CapabilityStatus, number>;
}
