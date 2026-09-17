# ADR-013: Domain-Owned Memory System Architecture

**Status:** Accepted | **Date:** 2026-07-23 | **Deciders:** Founder & Governance Agent
**Source:** Recorded in `.ai/memory/governance.md` (Approved); file-based record created 2026-09-17 during governance canonicalization

## Context

Institutional memory (engineering, decisions, releases, knowledge, agents, projects, research, tasks) must be durable, inspectable, and owned by the domain that produces it, rather than centralized in a single mutable store.

## Decision

Memory is organized as domain-owned subdirectories under `memory/<domain>/`, each with a `_meta.json` manifest describing its records. Runtime and tooling read and write within domain boundaries.

## Alternatives Considered

Not documented at the time this decision was recorded.

## Consequences

- Each domain owns and can evolve its memory independently.
- `_meta.json` manifests provide a machine-readable index per domain.
- Consumers must respect domain boundaries when reading or writing memory.
