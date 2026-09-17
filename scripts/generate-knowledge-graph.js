/* global require, __dirname, console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const registryDir = path.join(rootDir, "registry");

if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true });
}

const NOTICE =
  "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.";

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

// Deterministic writer: output stays byte-stable while sources are unchanged
// (ADR-012). The timestamp only moves when the generated content changes.
function writeRegistry(file, data) {
  const strip = (obj) => {
    const copy = { ...obj };
    delete copy.generated_at;
    delete copy.generatedAt;
    return JSON.stringify(copy);
  };
  const existing = fs.existsSync(file) ? readJSON(file, null) : null;
  const stampField = "generated_at" in data ? "generated_at" : "generatedAt";
  if (existing && strip(existing) === strip(data)) {
    data[stampField] = existing[stampField];
  } else {
    data[stampField] = new Date().toISOString();
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function generateKnowledgeGraph() {
  const nodes = [
    {
      id: "ADR-007",
      type: "adr",
      title: "Architectural Decision Records Standard",
      owner: "Architecture Board",
      status: "Accepted",
      created: "2026-07-15",
      updated: "2026-07-15",
      links: ["BAR-001", "Release-v0.1"],
    },
    {
      id: "ADR-008",
      type: "adr",
      title: "Provider-Agnostic AI Gateway Abstraction Layer",
      owner: "Engineering Agent",
      status: "Accepted",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["RFC-0003", "BPS-001", "Release-v0.3"],
    },
    {
      id: "RFC-0001",
      type: "rfc",
      title: "Volunteer Portal Architecture",
      owner: "Community Agent",
      status: "Proposed",
      created: "2026-07-20",
      updated: "2026-07-20",
      links: ["BDL-001", "agent.volunteer"],
    },
    {
      id: "RFC-0002",
      type: "rfc",
      title: "Forest GIS & Environmental Mapping Infrastructure",
      owner: "Forest Agent",
      status: "Proposed",
      created: "2026-07-21",
      updated: "2026-07-21",
      links: ["BAR-001", "agent.forest"],
    },
    {
      id: "RFC-0003",
      type: "rfc",
      title: "AI Gateway Abstraction & Routing Architecture",
      owner: "Engineering Agent",
      status: "Accepted",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["ADR-008", "agent.engineering"],
    },
    {
      id: "BAR-001",
      type: "standard",
      title: "Bhavya Architecture Rules",
      owner: "Governance Agent",
      status: "Active",
      created: "2026-07-15",
      updated: "2026-07-22",
      links: ["ADR-007", "ADR-008"],
    },
    {
      id: "BDL-001",
      type: "standard",
      title: "Bhavya Design Language",
      owner: "Design Agent",
      status: "Active",
      created: "2026-07-15",
      updated: "2026-07-22",
      links: ["packages/ui", "packages/theme"],
    },
    {
      id: "BPS-001",
      type: "standard",
      title: "Bhavya Production Standards",
      owner: "Release Agent",
      status: "Active",
      created: "2026-07-15",
      updated: "2026-07-22",
      links: ["ADR-008", "Release-v0.3"],
    },
    {
      id: "BGS-001",
      type: "standard",
      title: "Bhavya Governance Standards",
      owner: "Governance Agent",
      status: "Active",
      created: "2026-07-15",
      updated: "2026-07-22",
      links: ["agent.governance", "agent.founder"],
    },
    {
      id: "BOM-001",
      type: "standard",
      title: "Bhavya Operating Model",
      owner: "Founder Agent",
      status: "Active",
      created: "2026-07-15",
      updated: "2026-07-22",
      links: ["agent.founder", "agent.release"],
    },
    {
      id: "Release-v0.1",
      type: "release",
      title: "v0.1 Foundation Bootstrap",
      owner: "Release Agent",
      status: "Released",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["ADR-007", "BAR-001"],
    },
    {
      id: "Release-v0.2",
      type: "release",
      title: "v0.2 Platform Integration",
      owner: "Release Agent",
      status: "Released",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["RFC-0003", "agent.engineering"],
    },
    {
      id: "Release-v0.3",
      type: "release",
      title: "v0.3 Institutional Runtime",
      owner: "Release Agent",
      status: "Certified",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["ADR-008", "BPS-001"],
    },
    {
      id: "Release-v0.4",
      type: "release",
      title: "v0.4 Institutional Knowledge Platform",
      owner: "Release Agent",
      status: "Active",
      created: "2026-07-22",
      updated: "2026-07-22",
      links: ["ADR-007", "ADR-008", "RFC-0003"],
    },
  ];

  writeRegistry(path.join(registryDir, "knowledge-graph.json"), {
    _notice: NOTICE,
    version: "v1.0",
    generatedAt: null,
    generator: "scripts/generate-knowledge-graph.js",
    nodes,
  });
  console.log("OK: registry/knowledge-graph.json regenerated");
}

function generateSearchIndex() {
  const documents = [
    {
      id: "doc-adr-007",
      title: "ADR-007 Architectural Decision Records Standard",
      category: "ADR",
      path: "docs/adr/ADR-007-architectural-decision-records-standard.md",
      content:
        "Adopt ADR format for all significant engineering, architectural, and governance decisions.",
      tags: ["adr", "governance", "architecture"],
    },
    {
      id: "doc-adr-008",
      title: "ADR-008 Provider-Agnostic AI Gateway Abstraction Layer",
      category: "ADR",
      path: "docs/adr/ADR-008-provider-agnostic-ai-gateway.md",
      content:
        "Provider-agnostic AI Gateway architecture exposing generate, chat, embed, transcribe, reason endpoints.",
      tags: ["adr", "ai", "gateway", "architecture"],
    },
    {
      id: "doc-rfc-0003",
      title: "RFC-0003 AI Gateway Abstraction & Routing Architecture",
      category: "RFC",
      path: "rfcs/RFC-0003-AI-Gateway.md",
      content:
        "Technical RFC specifying the gateway routing pipeline, provider backends, and failover strategy.",
      tags: ["rfc", "ai", "gateway"],
    },
    {
      id: "doc-bar-0001",
      title: "BAR-001 Bhavya Architecture Rules",
      category: "Standard",
      path: "standards/BAR-001.md",
      content:
        "Monorepo dependency rules, no circular dependencies, design system isolation.",
      tags: ["standard", "bar", "architecture"],
    },
    {
      id: "doc-bdl-001",
      title: "BDL-001 Bhavya Design Language",
      category: "Standard",
      path: "standards/BDL-001.md",
      content:
        "UI design tokens, typography, visual hierarchy, color palette, accessibility WCAG AA.",
      tags: ["standard", "bdl", "design", "a11y"],
    },
    {
      id: "doc-bps-001",
      title: "BPS-001 Bhavya Production Standards",
      category: "Standard",
      path: "standards/BPS-001.md",
      content:
        "CI/CD quality gates, bundle budgets, automated testing requirements, release checklists.",
      tags: ["standard", "bps", "release", "quality"],
    },
  ];

  writeRegistry(path.join(registryDir, "search-index.json"), {
    _notice: NOTICE,
    version: "v1.0",
    generatedAt: null,
    generator: "scripts/generate-knowledge-graph.js",
    documents,
  });
  console.log("OK: registry/search-index.json regenerated");
}

generateKnowledgeGraph();
generateSearchIndex();
