# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 3.2.0
**Status:** Public Foundation Website — Thin presentation layer over source of truth

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## What We Built

### Public Foundation Website (v3.2.0)

A thin presentation layer. No business logic. Just rendering what Bhavya OS provides.

```
Visitor
  |
Website (Next.js)
  |
Public API (read-only)
  |
Transparency Platform (source of truth)
  |
Bhavya OS (kernel)
```

### Key Design Decisions

1. **Declarative pages** — Every page is a schema. The renderer assembles it.
2. **No business logic** — Website only queries and displays data.
3. **Content publishing** — Changes in Bhavya OS auto-reflect on website.
4. **Unified search** — One search across all content types.
5. **API separation** — Public (read-only), Partner (authenticated), Internal (full).

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
| v3.1.0 | Transparency & Governance Platform |
| **v3.2.0** | **Public Foundation Website** |

## Applications

| Application | Status | Description |
|-------------|--------|-------------|
| **Public Website** | Active | Thin presentation layer over source of truth |
| **Transparency & Governance** | Active | Source of truth for decisions, finance, projects |
| Knowledge Platform | Active | Upload, classify, index, search, summarize |
| Volunteer Platform | Planned | Onboard, manage, recognize volunteers |
| Heritage Platform | Planned | Preserve cultural heritage |
| Forest Platform | Planned | Restore and monitor forests |
| Library Platform | Planned | Digital library |
| Research Platform | Planned | Research management |
| Administration Platform | Planned | Internal operations |

## Development Rule

Every new feature must first be implemented as a Bhavya OS capability and then consumed by an application.

This prevents applications from developing their own business logic and keeps Bhavya OS as the single institutional platform.

## Compatibility Promise

These APIs are guaranteed stable:
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
| Stable | v3.2.0 | Current |
| Preview | v4.0-beta | Not started |
| Experimental | feature/* | Available |

## Next in Sequence

| Version | Application |
|---------|-------------|
| v3.3.0 | Volunteer Platform |
| v3.4.0 | Research Platform |
| v3.5.0 | Forest Platform |
| v3.6.0 | Heritage Platform |
| v3.7.0 | Library Platform |

## Important Documents

| Document | Location |
|----------|----------|
| Compatibility Promise | `docs/standards/COMPATIBILITY-PROMISE.md` |
| Release Channels | `docs/standards/RELEASE-CHANNELS.md` |
| CLI Spec | `docs/standards/CLI.md` |
| Website Schemas | `apps/website/src/lib/schemas.ts` |
| BRP Protocol | `docs/architecture/BRP.md` |

---

**Every coding session starts by reading this file.**

*Restoring Nature. Empowering Humanity. Preserving Heritage.*
