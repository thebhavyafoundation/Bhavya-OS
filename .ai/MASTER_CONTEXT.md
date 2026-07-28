# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 3.0.0
**Status:** Bhavya OS — Stable Platform, Applications Phase

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## What Changed

The OS is now **stable infrastructure**. We stopped building kernel modules and started building **applications** that solve real institutional problems.

## Compatibility Promise

These APIs are **guaranteed stable**. Breaking changes require a major version bump.

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
| Stable | v3.0.0 | Current |
| Preview | v4.0-beta | Not started |
| Experimental | feature/* | Available |

## Applications

| Application | Status | Description |
|-------------|--------|-------------|
| Knowledge Platform | Active | Upload, classify, index, search, summarize, track provenance |
| Website | Planned | Public website |
| Transparency Portal | Planned | Published reports, releases, financials |
| Volunteer Platform | Planned | Onboard, manage, recognize volunteers |
| Heritage Platform | Planned | Preserve cultural heritage |
| Forest Platform | Planned | Restore and monitor forests |
| Library Platform | Planned | Digital library |
| Research Platform | Planned | Research management |
| Administration Platform | Planned | Internal operations |

## CLI

```
bhavya create agent <name>        # Create agent definition
bhavya create workflow <name>     # Create workflow
bhavya create service <name>      # Create institution service
bhavya test workflow <name>       # Test workflow
bhavya inspect execution <id>     # Inspect execution
bhavya replay execution <id>      # Replay failed execution
bhavya doctor                     # Check system health
```

## Architecture

```
Applications (Knowledge, Website, Transparency, ...)
  |
Kernel (@bhavya/kernel)
  |
Engines (@bhavya/*-engine)
  |
Memory (.memory/)
  |
Agents (.agents/)
  |
Events (.events/)
```

## How To Use

```bash
# Clone
git clone https://github.com/thebhavyafoundation/Bhavya-OS.git

# Read the master context
cat .ai/MASTER_CONTEXT.md

# Start contributing
# Any AI model can read these files and immediately understand the system
```

## Engineering Priorities

Instead of asking: "What engine should we build next?"

Ask: "What institutional problem should Bhavya solve next?"

- A volunteer joins -> Can Bhavya onboard them end to end?
- A trustee approves a policy -> Can Bhavya publish it automatically?
- A research paper arrives -> Can Bhavya ingest, index, and connect it?
- A donation is received -> Can Bhavya update transparency records?

If the runtime supports those scenarios cleanly, it is succeeding.

## Important Documents

| Document | Location |
|----------|----------|
| Compatibility Promise | `docs/standards/COMPATIBILITY-PROMISE.md` |
| Release Channels | `docs/standards/RELEASE-CHANNELS.md` |
| CLI Spec | `docs/standards/CLI.md` |
| Knowledge Platform | `docs/applications/knowledge-platform.md` |
| BRP Protocol | `docs/architecture/BRP.md` |
| Frozen Contracts | `docs/standards/FROZEN-CONTRACTS.md` |

---

**Every coding session starts by reading this file.**

*Restoring Nature. Empowering Humanity. Preserving Heritage.*
