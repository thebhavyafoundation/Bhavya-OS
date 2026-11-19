# BFAOS V2 — D-09 Decision Brief: Artefact Store and Checkpoint Persistence

**Date:** 2026-11-18 · **Branch:** `feat/bfaos-phase4-contracts` · **Owner:** Founder · **Status:** Proposed (not implemented)

## 1. The decision

Kernel integration with Mission Control is blocked until the founder chooses a job-status vocabulary (D-08) and an artefact store / checkpoint persistence mechanism (D-09). Neither may be implemented without founder approval.

This brief covers D-09 only.

## 2. What the kernel already provides (tested, not wired)

`packages/kernel/src/checkpoint/index.ts` exports a checkpoint contract: payload + SHA-256 integrity + version gate. `packages/kernel/src/idempotency/index.ts` provides fail-closed idempotency with expiry normalisation. Neither persists checkpoints or artefacts outside memory; both are designed so the caller supplies the store.

## 3. Existing storage capabilities in the repository

| Capability | Location | Notes |
|---|---|---|
| `packages/database/data/bhavya.db` | Tracked seed file | SQLite, 782,336 bytes, 4 baseline migrations applied. Not modified, not part of any open PR. |
| `@bhavya/database` package | `packages/database/` | Shared migration runner, `computeChecksum`, `getReadWriteDatabase`. |
| IOC embedded migrations | `packages/database/migrations/ioc/` | 001 baseline, 002 FK indexes (002 not yet applied to dev db). |
| Cloudflare KV / R2 / D1 | Not configured | Deployed worker has no KV, R2, or D1 binding (ASSETS + secrets + self-reference only). |
| Cloudflare Assets | `wrangler.json` `assets` binding | Static asset serving only, not a general artefact store. |

## 4. What must be decided (D-09)

| Question | Options / notes |
|---|---|
| **Existing artifact storage** | Use `bhavya.db` (SQLite, already tracked), add a new table, or introduce KV/R2/D1? |
| **Payload and integrity** | Checkpoint = payload + SHA-256 + version (already defined in kernel). Store must preserve bytes exactly. |
| **Checkpoint retention** | How long are checkpoints kept? Retention policy? Pruning? |
| **Recovery requirements** | On resume, reload checkpoint, verify SHA-256, version-gate, fail-closed on mismatch/corruption. |
| **Security and access** | Who can read/write checkpoints? Encryption at rest? Access controls? |
| **Cost and operational complexity** | SQLite (zero new cost, single file) vs KV/R2/D1 (new Cloudflare service, cost, billing, permissions). |

## 5. Constraints

- No new paid services (free tier / existing infrastructure only)
- No production database access or writes
- No schema migrations in production
- No credential or permission changes

## 6. Recommendation

**Use the existing `bhavya.db` SQLite file** with a new `_checkpoints` table, via the existing `@bhavya/database` migration runner. Rationale:
- Zero new cost (no new service, no billing change)
- Already tracked and backed up (preservation procedure documented)
- SHA-256 integrity and version gate already in the kernel contract
- Idempotency loader already handles corrupt entries fail-closed
- No new credentials, permissions, or production schema changes

**Do not implement yet.** Add migrations through the IOC-style governance procedure (mirror + parity specs) only after founder approval. Implementation follows approval.
