import type { Capability, CapabilityScores } from "./types.js";

// ─── Bhavya Score Calculator ───────────────────────────────────────────────
// Composite score (0-100) based on weighted capability scores.

const WEIGHTS: Record<keyof CapabilityScores, number> = {
  performance: 0.1,
  easeOfIntegration: 0.12,
  maintenance: 0.12,
  community: 0.08,
  security: 0.1,
  offlineCapability: 0.08,
  cloudCapability: 0.05,
  resourceUsage: 0.05,
  educationalValue: 0.08,
  futureProof: 0.08,
  vendorLockin: 0.07,
  openSourceHealth: 0.07,
};

export function calculateBhavyaScore(scores: CapabilityScores): number {
  let total = 0;
  let weightSum = 0;

  for (const [key, weight] of Object.entries(WEIGHTS) as [
    keyof CapabilityScores,
    number,
  ][]) {
    total += (scores[key] || 0) * weight;
    weightSum += weight;
  }

  return Math.round((total / weightSum) * 10);
}

// ─── Auto-Evaluate ─────────────────────────────────────────────────────────
// Heuristic scoring based on observable data.

export function autoEvaluate(
  capability: Partial<Capability>,
): CapabilityScores {
  return {
    performance: estimatePerformance(capability),
    easeOfIntegration: estimateEaseOfIntegration(capability),
    maintenance: estimateMaintenance(capability),
    community: estimateCommunity(capability),
    security: estimateSecurity(capability),
    offlineCapability: capability.offlineSupport ? 8 : 3,
    cloudCapability: capability.cloudSupport ? 8 : 4,
    resourceUsage: estimateResourceUsage(capability),
    educationalValue: estimateEducationalValue(capability),
    futureProof: estimateFutureProof(capability),
    vendorLockin: estimateVendorLockin(capability),
    openSourceHealth: estimateOpenSourceHealth(capability),
  };
}

function estimatePerformance(c: Partial<Capability>): number {
  if (c.type === "rust_tool" || c.type === "go_binary") return 9;
  if (c.type === "cli_tool") return 8;
  if (c.type === "node_package" || c.type === "python_package") return 6;
  return 5;
}

function estimateEaseOfIntegration(c: Partial<Capability>): number {
  let score = 5;
  if (c.mcpAvailable) score += 3;
  if (c.cliAvailable) score += 2;
  if (c.dockerAvailable) score += 1;
  if (c.browserAutomationPossible) score += 1;
  if (c.apiRequired) score -= 2;
  return Math.min(10, Math.max(1, score));
}

function estimateMaintenance(c: Partial<Capability>): number {
  if (!c.lastCommit) return 3;
  const daysSinceUpdate =
    (Date.now() - new Date(c.lastCommit).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) return 9;
  if (daysSinceUpdate < 30) return 8;
  if (daysSinceUpdate < 90) return 6;
  if (daysSinceUpdate < 365) return 4;
  return 2;
}

function estimateCommunity(c: Partial<Capability>): number {
  const stars = c.stars || 0;
  if (stars > 10000) return 9;
  if (stars > 5000) return 8;
  if (stars > 1000) return 7;
  if (stars > 500) return 6;
  if (stars > 100) return 5;
  if (stars > 0) return 4;
  return 3;
}

function estimateSecurity(c: Partial<Capability>): number {
  let score = 5;
  if (c.license) score += 1;
  if (c.type === "mcp_server") score -= 1; // MCP servers have elevated risk
  if (c.authentication === "none") score += 1;
  if (c.offlineSupport) score += 1;
  return Math.min(10, Math.max(1, score));
}

function estimateResourceUsage(c: Partial<Capability>): number {
  if (c.resourceUsage === "low") return 9;
  if (c.resourceUsage === "medium") return 6;
  return 3;
}

function estimateEducationalValue(c: Partial<Capability>): number {
  if (c.type === "course") return 9;
  if (c.type === "documentation") return 8;
  if (c.type === "dataset") return 7;
  if (c.category?.includes("education")) return 8;
  return 5;
}

function estimateFutureProof(c: Partial<Capability>): number {
  let score = 5;
  if (c.openSourceHealth && c.openSourceHealth > 7) score += 2;
  if (c.community && c.community > 7) score += 1;
  if (c.maintenance && c.maintenance > 7) score += 1;
  return Math.min(10, score);
}

function estimateVendorLockin(c: Partial<Capability>): number {
  let score = 7;
  if (c.offlineSupport) score += 2;
  if (c.type === "open_source" || c.license) score += 1;
  if (c.apiRequired) score -= 2;
  return Math.min(10, Math.max(1, score));
}

function estimateOpenSourceHealth(c: Partial<Capability>): number {
  if (!c.license) return 3;
  if (
    c.license === "MIT" ||
    c.license === "Apache-2.0" ||
    c.license === "BSD-2-Clause" ||
    c.license === "BSD-3-Clause"
  )
    return 9;
  if (c.license === "GPL-3.0" || c.license === "GPL-2.0") return 7;
  if (c.license === "LGPL-3.0") return 6;
  if (c.license === "MPL-2.0") return 6;
  return 5;
}
