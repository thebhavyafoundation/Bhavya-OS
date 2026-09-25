# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 3.3.0
**Status:** Mission Operations Platform -- Operational command center for every initiative
**Authority:** **Non-authoritative for routing and architecture.** L0 router is
`AGENTS.md`; start sessions there. This file is operational history/status for
`.ai/` only and must not override `docs/constitution/` or `AGENTS.md`.

---

## Current Mission

Build the world's first AI Native Foundation Operating System -- a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## What We Built

### Mission Operations Platform (v3.3.0)

The operational command center. Every initiative runs through here.

```
Mission Operations
  |
  +-- Mission Service (lifecycle, objectives)
  +-- Resource Registry (volunteers, equipment, grants)
  +-- Impact Registry (metrics, reports)
  |
Kernel (@bhavya/kernel)
```

### Application Architecture

```
Website (presentation)
  |
Transparency Platform (source of truth)
  |
Mission Operations (command center)
  |
Bhavya OS (kernel)
```

### Version History

| Version      | Milestone                          |
| ------------ | ---------------------------------- |
| v1.0.0-alpha | Repository Foundation              |
| v1.1.0-alpha | Kernel Runtime                     |
| v1.2.0-alpha | Productive Runtime                 |
| v1.3.0-alpha | Institution Services               |
| v1.4.0-alpha | Autonomous Coordination            |
| v2.0.0-beta  | Production Platform                |
| v3.0.0       | Bhavya OS + Knowledge Platform     |
| v3.1.0       | Transparency & Governance Platform |
| v3.2.0       | Public Foundation Website          |
| **v3.3.0**   | **Mission Operations Platform**    |

## Applications

| Application                   | Status  | Description                                      |
| ----------------------------- | ------- | ------------------------------------------------ |
| **Mission Operations**        | Active  | Operational command center for every initiative  |
| **Public Website**            | Active  | Thin presentation layer over source of truth     |
| **Transparency & Governance** | Active  | Source of truth for decisions, finance, projects |
| Knowledge Platform            | Active  | Upload, classify, index, search, summarize       |
| Volunteer Platform            | Planned | People, onboarding, training, role assignments   |
| Forest Mission                | Planned | Module within Mission Operations                 |
| Heritage Mission              | Planned | Module within Mission Operations                 |
| Library Mission               | Planned | Module within Mission Operations                 |

## Mission Lifecycle

```
Mission
  -> Objectives
  -> Projects
  -> Milestones
  -> Tasks
  -> Resources
  -> Evidence
  -> Impact
  -> Archive
```

Every mission shares this lifecycle. Forest, Heritage, Library become modules.

## Development Rule

Every new feature must first be implemented as a Bhavya OS capability and then consumed by an application.

## Compatibility Promise

These APIs are guaranteed stable:

- Kernel API v1, BRP v1, Memory API v1, Events API v1
- Planner API v1, Registry API v1, Coordinator API v1
- Replay API v1, Auth API v1, Monitoring API v1

## Release Channels

| Channel      | Version   | Status      |
| ------------ | --------- | ----------- |
| LTS          | v3.x      | Planned     |
| Stable       | v3.3.0    | Current     |
| Preview      | v4.0-beta | Not started |
| Experimental | feature/* | Available   |

## Next in Sequence

| Version | Application             |
| ------- | ----------------------- |
| v3.4.0  | Volunteer Platform      |
| v3.5.0  | Research Platform       |
| v3.6.0  | Forest Mission Module   |
| v3.7.0  | Heritage Mission Module |
| v3.8.0  | Library Mission Module  |
| v4.0.0  | Mission Intelligence    |

## Important Documents

| Document              | Location                                  |
| --------------------- | ----------------------------------------- |
| Compatibility Promise | `docs/standards/COMPATIBILITY-PROMISE.md` |
| Release Channels      | `docs/standards/RELEASE-CHANNELS.md`      |
| CLI Spec              | `docs/standards/CLI.md`                   |
| Mission Operations    | `docs/releases/v3.3.0.md`                 |
| BRP Protocol          | `docs/architecture/BRP.md`                |

---

**Routing entry point:** `AGENTS.md` (L0) → `CONTEXT.md` (L1). Read this file only when working on `.ai/` mission-ops status.

_Restoring Nature. Empowering Humanity. Preserving Heritage._
