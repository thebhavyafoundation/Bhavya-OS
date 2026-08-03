# GitHub OS — Architecture Decision Records

## ADR-001: Package Promotion Rule

**Status:** Accepted
**Date:** August 2026

### Context

We need a rule for when to create shared packages vs keeping code in applications.

### Decision

**Shared packages are earned, not planned.**

Promotion path:

```
Application Module → Used Successfully → Required By Second App → Promote To Package → Version → Document → Maintain
```

### Consequences

- Reduces premature abstraction
- Ensures packages solve real problems
- Creates natural versioning
- Reduces package sprawl

---

## ADR-002: API-Free First

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how to integrate with external services.

### Decision

**Prefer MCP > CLI > Browser > Official API > Build from scratch.**

Priority hierarchy:

1. MCP Server (preferred)
2. CLI Tool
3. Browser Automation
4. Official API
5. Build from scratch

### Consequences

- Reduces API key management
- Increases reliability (no rate limits)
- Improves security (no tokens in code)
- Enables offline operation

---

## ADR-003: Dark Mode First

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide the visual design direction.

### Decision

**Dark mode first, light mode later.**

Design principles:

- Dark backgrounds (#0a0a0a, #111111, #1a1a1a)
- Light text (#fafafa, #a1a1aa)
- Linear / Vercel aesthetic
- Glassmorphism elements

### Consequences

- Reduces eye strain
- Modern aesthetic
- Better for developers
- Light mode can be added later

---

## ADR-004: SQLite for Local Storage

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide the database for local storage.

### Decision

**SQLite with better-sqlite3 for Windows compatibility.**

Alternatives considered:

- PostgreSQL (too heavy for local)
- MySQL (not portable)
- JSON files (no queries)
- better-sqlite3 (selected)

### Consequences

- Simple deployment
- No server required
- Portable
- Windows compatible

---

## ADR-005: Next.js for UI

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide the UI framework.

### Decision

**Next.js 14 with App Router, React 18, TypeScript.**

Alternatives considered:

- Vite (no SSR)
- Svelte (ecosystem smaller)
- Remix (less mature)
- Next.js (selected)

### Consequences

- Server-side rendering
- Great DX
- Large ecosystem
- Vercel deployment

---

## ADR-006: Event-Driven Architecture

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how components communicate.

### Decision

**Event-driven architecture with domain events.**

Pattern:

```
Component A → Event → Event Bus → Component B
```

### Consequences

- Loose coupling
- Scalability
- Observability
- Async processing

---

## ADR-007: AI-Native Design

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how AI integrates with the platform.

### Decision

**AI is a participant, not a feature.**

Principles:

- AI suggests, humans decide
- Context is king
- Learning is continuous
- Transparency
- Hardware aware

### Consequences

- Better suggestions
- User trust
- Continuous improvement
- Ethical AI

---

## ADR-008: Monorepo Structure

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide the project structure.

### Decision

**Monorepo with pnpm workspaces + Turborepo.**

Structure:

```
apps/           — Applications
packages/       — Shared packages
docs/           — Documentation
bhavya-ai-lab/  — Data and knowledge
```

### Consequences

- Single source of truth
- Shared dependencies
- Atomic commits
- Better DX

---

## ADR-009: Provider Pattern

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how to handle external integrations.

### Decision

**Every integration uses a provider interface.**

Pattern:

```typescript
interface Provider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(operation: Operation): Promise<Result>;
}
```

### Consequences

- Testability
- Swappability
- Consistency
- Clear boundaries

---

## ADR-010: Knowledge Package Format

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how to store institutional knowledge.

### Decision

**Knowledge Packages as the canonical format.**

Format:

```typescript
interface KnowledgePackage {
  id: string;
  source: Source;
  category: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  tags: string[];
  bhavyaScore: number;
}
```

### Consequences

- Consistent format
- Searchable
- Linkable
- Quality-scored

---

## ADR-011: Bhavya Score

**Status:** Accepted
**Date:** August 2026

### Context

We need to measure quality of knowledge packages.

### Decision

**Bhavya Score (0-100) with 12 weighted factors.**

Factors:

- Completeness (15%)
- Accuracy (15%)
- Timeliness (10%)
- Relevance (10%)
- Uniqueness (10%)
- Citations (5%)
- Peer Review (5%)
- Usage (10%)
- Feedback (5%)
- Impact (5%)
- Maintenance (5%)
- Community (5%)

### Consequences

- Objective quality measure
- Continuous improvement
- Incentivizes quality
- Data-driven decisions

---

## ADR-012: Hardware Awareness

**Status:** Accepted
**Date:** August 2026

### Context

We need to ensure the platform runs on modest hardware.

### Decision

**Must run on Intel i3, 8GB RAM, no GPU.**

Constraints:

- Background services < 500MB RAM
- Disk usage < 2GB
- No GPU required
- Offline capable

### Consequences

- Accessible to more users
- Lower cost
- Better performance
- Portable

---

## ADR-013: Human Approval Gate

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how AI actions are controlled.

### Decision

**Nothing changes without human review.**

Gate:

```
AI Suggestion → Human Review → Approval → Action
```

### Consequences

- Safety
- Trust
- Accountability
- Quality control

---

## ADR-014: Continuous Intelligence

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide how intelligence is gathered.

### Decision

**Continuous intelligence on multiple schedules.**

Schedules:

- Hourly: Quick scans
- Daily: Deep analysis
- Weekly: Trend analysis
- Monthly: Strategic review

### Consequences

- Always up-to-date
- Proactive insights
- Trend detection
- Strategic alignment

---

## ADR-015: Open Source First

**Status:** Accepted
**Date:** August 2026

### Context

We need to decide the licensing and open source strategy.

### Decision

**Open source first, proprietary only when necessary.**

Principles:

- MIT license for code
- CC BY-SA for documentation
- Open by default
- Proprietary only for sensitive data

### Consequences

- Community contribution
- Transparency
- Trust
- Talent attraction
