# Explicit Non-Goals

Do **not**:

- create a new registry, runtime, routing layer, or executable ICM **index**;
- install missing skills to satisfy a stale index;
- silently resolve constitutional conflicts;
- delete runtime surfaces (`.ai/build/`, `packages/runtime/`, `platform/ai-runtime/`);
- consolidate packages or merge `@bhavya/shared` / `@bhavya/types`;
- change brand tokens;
- invent architecture because a document claims it should exist.

**ICM workflow layer is permitted** for repeatable pipelines (RFC→Spec→Impl→Verify→Deploy). The `stages/` directories are ICM stage contracts, not a runtime/index. No ICM runtime, database, or router.
