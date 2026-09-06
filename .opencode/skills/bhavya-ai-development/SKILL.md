---
name: bhavya-ai-development
description: Guide AI agent development within Bhavya Foundation. Use when designing, implementing, or modifying AI agents, workflows, or intelligence systems.
compatibility: opencode
---

# Bhavya AI Development Skill

## Purpose

Ensure AI agents within Bhavya Foundation have clear purpose, appropriate constraints, and proper audit trails.

## Agent Architecture

AI agents in Bhavya Foundation follow a structured pattern:

### Required Properties

Every agent must have:
1. **Purpose** — What the agent does and why
2. **Inputs** — What data the agent receives
3. **Outputs** — What the agent produces
4. **Tools** — What capabilities the agent has
5. **Permissions** — What the agent can access
6. **Approval requirements** — What needs human approval
7. **Audit trail** — How agent actions are logged
8. **Failure behavior** — What happens when the agent fails

### Existing Agent Roles

Defined in `.ai/agents/registry.yaml`:

| Agent | Purpose |
|-------|---------|
| architecture | System design, dependency analysis, ADR authoring |
| frontend | React, Next.js, TypeScript, Tailwind, accessibility |
| backend | API design, Node.js, data modeling, auth |
| documentation | Technical writing, specs, API docs |
| release | Versioning, changelog, CI/CD |
| testing | Unit tests, accessibility, E2E, quality gates |
| security | Security review, vulnerability scanning |
| devops | Docker, CI/CD, infrastructure, monitoring |
| research | Technology evaluation, RFC authoring |

## Potential Agent Categories

These agent types may be needed. Document the architecture unless implementation exists:

### Research Agent
- Purpose: Gather and synthesize information from external sources
- Inputs: Research questions, data sources
- Outputs: Reports, summaries, recommendations
- Approval: None for research, human review for recommendations

### Grant Agent
- Purpose: Identify and draft grant applications
- Inputs: Grant opportunities, institutional data
- Outputs: Draft applications, deadlines, requirements
- Approval: Human review before submission

### Forest Intelligence Agent
- Purpose: Monitor and analyze forest mission data
- Inputs: Observation data, satellite imagery, sensor data
- Outputs: Analysis reports, alerts, recommendations
- Approval: Human review for significant decisions

### Knowledge Agent
- Purpose: Process and organize knowledge base content
- Inputs: Documents, articles, research papers
- Outputs: Structured knowledge items, connections, summaries
- Approval: None for processing, human review for publication

### Heritage Agent
- Purpose: Document and preserve heritage information
- Inputs: Site data, historical records, community input
- Outputs: Heritage records, preservation recommendations
- Approval: Human review for all outputs

### Impact Agent
- Purpose: Measure and report institutional impact
- Inputs: Activity data, metrics, outcomes
- Outputs: Impact reports, dashboards, recommendations
- Approval: Human review for published reports

### Communications Agent
- Purpose: Draft and schedule communications
- Inputs: News, updates, audience data
- Outputs: Draft posts, email content, social media
- Approval: Human review before publishing

### Governance Agent
- Purpose: Monitor governance compliance and decisions
- Inputs: Policies, decisions, meeting records
- Outputs: Compliance reports, decision logs
- Approval: Human review for all outputs

## Rules

1. **AI is not the source of truth.** AI can research, draft, analyze, classify, recommend, transform, summarize. AI must not silently invent institutional facts.
2. **Consequential actions require human approval.** Publishing, submitting, financial decisions, external communications.
3. **Audit trail is mandatory.** Log what the agent did, what data it accessed, what decisions it made.
4. **Failure must be safe.** Agents should fail gracefully, not silently corrupt data.
5. **Scope must be bounded.** Each agent has clear boundaries. No unlimited access.
