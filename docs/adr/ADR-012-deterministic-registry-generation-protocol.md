# ADR-012: Deterministic Registry Generation Protocol

**Status:** Accepted | **Date:** 2026-07-23 | **Deciders:** Founder & Governance Agent
**Source:** Recorded in `.ai/memory/governance.md` (Approved); file-based record created 2026-09-17 during governance canonicalization

## Context

Registry artifacts under `registry/` (packages, apps, standards, capabilities, knowledge graph, search index) are consumed by runtime code, documentation apps, and agents. Hand-editing generated JSON invites drift between source declarations and derived state.

## Decision

All files under `registry/` are generated deterministically by `scripts/generate-registry.js` from repository sources. Registry files are never edited manually. Registry regeneration is required before every release.

## Alternatives Considered

Not documented at the time this decision was recorded.

## Consequences

- Registry output is reproducible from source.
- Contributors regenerate rather than hand-edit registry files.
- `scripts/generate-registry.js` is a required, maintained asset.
