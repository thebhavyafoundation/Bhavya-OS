#!/usr/bin/env node
/**
 * Bhavya OS — Agent Registry Generator
 * Generates role.md, permissions.json, scope.json, responsibilities.md for each agent.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = "F:\\Bhavya Foundation\\platform\\agents";

const agents = [
  {
    id: "chief-architect",
    role: "Chief Architect",
    description: "Oversees architecture decisions, system design, and technical direction.",
    permissions: ["read", "write", "review", "approve", "reject"],
    scope: {
      paths: ["packages/*", "platform/*", "docs/architecture/*"],
      packages: ["*"],
      actions: ["architecture-review", "design-decision", "technical-direction"],
    },
    responsibilities: [
      "Define and maintain architecture standards",
      "Review and approve architecture decisions",
      "Guide technical direction of the platform",
      "Ensure consistency across all packages",
      "Maintain architecture documentation",
      "Lead technical design reviews",
    ],
  },
  {
    id: "project-manager",
    role: "Project Manager",
    description: "Manages tasks, priorities, and project coordination.",
    permissions: ["read", "write", "assign", "prioritize"],
    scope: {
      paths: [".tasks/*", "docs/*"],
      packages: ["*"],
      actions: ["task-management", "priority-setting", "coordination"],
    },
    responsibilities: [
      "Create and manage task queue",
      "Assign tasks to appropriate agents",
      "Track progress and blockers",
      "Coordinate cross-team work",
      "Generate status reports",
      "Manage sprint planning",
    ],
  },
  {
    id: "repo-intelligence",
    role: "Repository Intelligence",
    description: "Indexes and analyzes the repository structure.",
    permissions: ["read", "scan", "index"],
    scope: {
      paths: ["*"],
      packages: ["*"],
      actions: ["indexing", "analysis", "graph-generation"],
    },
    responsibilities: [
      "Index repository structure",
      "Generate dependency graphs",
      "Map routes and components",
      "Track file changes",
      "Maintain repository index",
      "Provide repository analytics",
    ],
  },
  {
    id: "frontend-engineer",
    role: "Frontend Engineer",
    description: "Builds and maintains frontend applications.",
    permissions: ["read", "write", "build", "test"],
    scope: {
      paths: ["apps/*"],
      packages: ["apps/*"],
      actions: ["implement", "refactor", "test", "deploy"],
    },
    responsibilities: [
      "Build user interfaces",
      "Implement responsive designs",
      "Ensure accessibility compliance",
      "Write component tests",
      "Optimize performance",
      "Integrate with backend APIs",
    ],
  },
  {
    id: "backend-engineer",
    role: "Backend Engineer",
    description: "Builds and maintains backend packages and services.",
    permissions: ["read", "write", "build", "test"],
    scope: {
      paths: ["packages/*"],
      packages: ["packages/*"],
      actions: ["implement", "refactor", "test", "deploy"],
    },
    responsibilities: [
      "Build platform packages",
      "Implement APIs and services",
      "Write unit and integration tests",
      "Optimize performance",
      "Ensure security best practices",
      "Maintain documentation",
    ],
  },
  {
    id: "design-system",
    role: "Design System",
    description: "Maintains the design system and UI component library.",
    permissions: ["read", "write", "review"],
    scope: {
      paths: ["packages/platform-ui/*", "docs/design-system/*"],
      packages: ["@bhavya/platform-ui"],
      actions: ["design-system-maintenance", "component-development", "token-management"],
    },
    responsibilities: [
      "Maintain design tokens",
      "Develop and update UI components",
      "Ensure visual consistency",
      "Document component usage",
      "Review design-related changes",
      "Manage design system versioning",
    ],
  },
  {
    id: "qa-engineer",
    role: "QA Engineer",
    description: "Ensures quality through testing and validation.",
    permissions: ["read", "test", "report", "reject"],
    scope: {
      paths: ["*"],
      packages: ["*"],
      actions: ["testing", "validation", "quality-gates"],
    },
    responsibilities: [
      "Run automated tests",
      "Validate build outputs",
      "Check accessibility compliance",
      "Verify performance metrics",
      "Report quality issues",
      "Maintain test infrastructure",
    ],
  },
  {
    id: "security-engineer",
    role: "Security Engineer",
    description: "Ensures security best practices and compliance.",
    permissions: ["read", "audit", "review", "reject"],
    scope: {
      paths: ["*"],
      packages: ["*"],
      actions: ["security-audit", "dependency-review", "vulnerability-scan"],
    },
    responsibilities: [
      "Audit code for security issues",
      "Review dependencies for vulnerabilities",
      "Ensure secrets are not exposed",
      "Validate authentication patterns",
      "Maintain security policies",
      "Report security findings",
    ],
  },
  {
    id: "devops-engineer",
    role: "DevOps Engineer",
    description: "Manages deployment, CI/CD, and infrastructure.",
    permissions: ["read", "deploy", "monitor", "configure"],
    scope: {
      paths: [".github/*", "vercel.json", "turbo.json"],
      packages: ["*"],
      actions: ["deployment", "monitoring", "infrastructure"],
    },
    responsibilities: [
      "Manage deployment pipelines",
      "Configure CI/CD workflows",
      "Monitor application health",
      "Manage environment variables",
      "Handle infrastructure changes",
      "Optimize build performance",
    ],
  },
  {
    id: "documentation",
    role: "Documentation",
    description: "Maintains and generates documentation.",
    permissions: ["read", "write", "review"],
    scope: {
      paths: ["docs/*", "*.md"],
      packages: ["*"],
      actions: ["documentation", "blogging", "changelog"],
    },
    responsibilities: [
      "Write and maintain documentation",
      "Generate API documentation",
      "Create release notes",
      "Update README files",
      "Document architecture decisions",
      "Maintain changelog",
    ],
  },
];

// Generate agent files
for (const agent of agents) {
  const agentDir = join(ROOT, agent.id);
  mkdirSync(agentDir, { recursive: true });

  // role.md
  writeFileSync(join(agentDir, "role.md"), `# ${agent.role}

${agent.description}

## Permissions

${agent.permissions.map(p => `- \`${p}\``).join("\n")}

## Scope

### Paths
${agent.scope.paths.map(p => `- \`${p}\``).join("\n")}

### Packages
${agent.scope.packages.map(p => `- \`${p}\``).join("\n")}

### Actions
${agent.scope.actions.map(a => `- ${a}`).join("\n")}

## Responsibilities

${agent.responsibilities.map(r => `- ${r}`).join("\n")}
`);

  // permissions.json
  writeFileSync(join(agentDir, "permissions.json"), JSON.stringify({
    agent: agent.id,
    permissions: agent.permissions,
    scope: agent.scope,
  }, null, 2));

  // scope.json
  writeFileSync(join(agentDir, "scope.json"), JSON.stringify({
    agent: agent.id,
    paths: agent.scope.paths,
    packages: agent.scope.packages,
    actions: agent.scope.actions,
  }, null, 2));

  // responsibilities.md
  writeFileSync(join(agentDir, "responsibilities.md"), `# ${agent.role} — Responsibilities

${agent.responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n")}
`);

  console.log(`  ✅ ${agent.id}/`);
}

console.log(`\n🎉 Agent Registry generated: ${agents.length} agents`);
