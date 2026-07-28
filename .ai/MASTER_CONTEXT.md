# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 3.1.0
**Status:** Transparency & Governance Platform — The institution's source of truth

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## What We Built

### Transparency & Governance Platform (v3.1.0)

The institution's source of truth. Every other application consumes from here.

```
Transparency Platform
  |
  +-- Governance Service (decisions, approvals, resolutions)
  +-- Finance Service (budgets, grants, donations)
  +-- Projects Service (lifecycle, milestones, impact)
  +-- Audit Service (trail, compliance, snapshots)
  +-- Public API (REST endpoints)
  |
Kernel (@bhavya/kernel)
  |
Engines (@bhavya/*-engine)
  |
Memory (.memory/)
```

### Application Architecture

```
Website (presentation)
  |
Transparency Platform (source of truth)
  |
Institution Registry
  |
Bhavya OS (kernel)
```

Instead of hardcoded JSON, the Website reads from the Transparency Platform.

### Version History

| Version | Milestone |
|---------|----------|
| v1.0.0-alpha | Repository Foundation |
| v1.1.0-alpha | Kernel Runtime |
| v1.2.0-alpha | Productive Runtime |
| v1.3.0-alpha | Institution Services |
| v1.4.0-alpha | Autonomous Coordination |
| v2.0.0-beta | Production Platform |
| v3.0.0 | Bhavya OS + Knowledge Platform |
| **v3.1.0** | **Transparency & Governance Platform** |

## Applications

| Application | Status | Description |
|-------------|--------|-------------|
| **Transparency & Governance** | Active | Source of truth for decisions, finance, projects |
| Knowledge Platform | Active | Upload, classify, index, search, summarize |
| Website | Planned | Public presentation powered by source of truth |
| Volunteer Platform | Planned | Onboard, manage, recognize volunteers |
| Heritage Platform | Planned | Preserve cultural heritage |
| Forest Platform | Planned | Restore and monitor forests |
| Library Platform | Planned | Digital library |
| Research Platform | Planned | Research management |
| Administration Platform | Planned | Internal operations |

## Compatibility Promise

These APIs are **guaranteed stable**:
- Kernel API v1
- BRP v1
- Memory API v1
- Events API v1
- Planner API v1
- Registry API v1
- Coordinator API v1
- Replay API v1
- Auth API v1
- Monitoring API v1

## Release Channels

| Channel | Version | Status |
|---------|---------|--------|
| LTS | v3.x | Planned |
| Stable | v3.1.0 | Current |
| Preview | v4.0-beta | Not started |
| Experimental | feature/* | Available |

## Engineering Priorities

Instead of asking: "What engine should we build next?"

Ask: "What institutional problem should Bhavya solve next?"

- A trustee approves a policy -> Can Bhavya publish it automatically?
- A donation is received -> Can Bhavya update transparency records?
- A project is started -> Can Bhavya track milestones and impact?
- A volunteer joins -> Can Bhavya onboard them end to end?

If the runtime supports those scenarios cleanly, it is succeeding.

## CLI

```
bhavya create agent/workflow/service
bhavya test agent/workflow/service/all
bhavya inspect execution/agent/memory/event
bhavya replay execution/workflow
bhavya doctor
```

## Important Documents

| Document | Location |
|----------|----------|
| Compatibility Promise | `docs/standards/COMPATIBILITY-PROMISE.md` |
| Release Channels | `docs/standards/RELEASE-CHANNELS.md` |
| CLI Spec | `docs/standards/CLI.md` |
| Knowledge Platform | `docs/applications/knowledge-platform.md` |
| Transparency Platform | `docs/releases/v3.1.0.md` |
| BRP Protocol | `docs/architecture/BRP.md` |
| Frozen Contracts | `docs/standards/FROZEN-CONTRACTS.md` |

---

**Every coding session starts by reading this file.**

*Restoring Nature. Empowering Humanity. Preserving Heritage.*
