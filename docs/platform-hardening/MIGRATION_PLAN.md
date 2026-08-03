# Migration Plan

**Purpose:** Track all schema and configuration changes that require migration or careful handling.

---

## Database Migrations

### Migration 1: Add Indexes

**Type:** Additive (no data loss)
**Risk:** LOW

```sql
-- Indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_ko_user_id ON knowledge_objects(user_id);
CREATE INDEX IF NOT EXISTS idx_ko_status ON knowledge_objects(status);
CREATE INDEX IF NOT EXISTS idx_ko_domain ON knowledge_objects(domain);
CREATE INDEX IF NOT EXISTS idx_kp_user_id ON knowledge_packages(user_id);
CREATE INDEX IF NOT EXISTS idx_kp_ko_id ON knowledge_packages(ko_id);
CREATE INDEX IF NOT EXISTS idx_kp_status ON knowledge_packages(publication_status);
CREATE INDEX IF NOT EXISTS idx_art_ko_id ON artifacts(ko_id);
CREATE INDEX IF NOT EXISTS idx_art_package_id ON artifacts(package_id);
CREATE INDEX IF NOT EXISTS idx_art_type ON artifacts(type);
CREATE INDEX IF NOT EXISTS idx_pe_user_id ON pipeline_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_pe_ko_id ON pipeline_executions(ko_id);
CREATE INDEX IF NOT EXISTS idx_pe_package_id ON pipeline_executions(package_id);
CREATE INDEX IF NOT EXISTS idx_pe_status ON pipeline_executions(status);
```

**Rollback:** `DROP INDEX` for each.

### Migration 2: Add Timestamp Defaults

**Type:** Additive
**Risk:** LOW

```sql
-- Ensure all tables have proper timestamp defaults
-- Already present in schema, but verify on existing DB
ALTER TABLE knowledge_objects ADD COLUMN updated_at TEXT DEFAULT (datetime('now'));
ALTER TABLE knowledge_packages ADD COLUMN updated_at TEXT DEFAULT (datetime('now'));
```

**Note:** SQLite doesn't support `ALTER COLUMN`, so if columns exist without defaults, we need to recreate tables. Check first.

### Migration 3: Add CHECK Constraints

**Type:** Additive
**Risk:** LOW (only if we add them)

```sql
-- Not implemented in this sprint — documented for future
-- ALTER TABLE knowledge_objects ADD CHECK (status IN ('draft', 'review', 'published'));
-- ALTER TABLE users ADD CHECK (role IN ('editor', 'admin', 'viewer'));
```

**Decision:** Skip CHECK constraints in this sprint. Document as future improvement.

---

## Configuration Migrations

### Migration 4: Environment Variables

**Type:** Additive
**Risk:** LOW

New environment variables required:

| Variable          | Location                | Required | Default                                       |
| ----------------- | ----------------------- | -------- | --------------------------------------------- |
| `RUNTIME_API_KEY` | Runtime API `.env`      | Yes      | —                                             |
| `NEXTAUTH_SECRET` | Knowledge Studio `.env` | Yes      | —                                             |
| `CORS_ORIGINS`    | Runtime API `.env`      | No       | `http://localhost:3020,http://localhost:3030` |

**Migration steps:**

1. Generate `RUNTIME_API_KEY` (32+ byte random string)
2. Generate `NEXTAUTH_SECRET` (32+ byte random string)
3. Add both to respective `.env` files
4. Update lesson-studio to pass API key in requests

### Migration 5: Package Dependencies

**Type:** Additive/Remove
**Risk:** MEDIUM

Changes to `package.json` files:

**knowledge-studio:**

- Remove: `lucide-react` (unused)
- Keep: `tailwindcss` (for future migration)

**bee:**

- Add: `@bhavya/runtime: "workspace:*"` (replace relative import)

**Root:**

- Remove: `next`, `react`, `react-dom` from `dependencies` (keep in `devDependencies`)
- Update: `version` from `0.1.0` to `3.1.0`

**@bhavya/ui:**

- Decision: Keep as-is (stub) but remove from apps that list it as dependency
- Apps affected: dashboard, forest, heritage, volunteer, knowledge

**Migration steps:**

1. Update each package.json
2. Run `pnpm install` to update lockfile
3. Verify no broken imports

---

## Code Migrations

### Migration 6: BEE Import Path

**Type:** Refactor
**Risk:** LOW

**Before:**

```javascript
import { createRegistry } from "../../runtime/src/registry-loader.mjs";
```

**After:**

```javascript
import { createRegistry } from "@bhavya/runtime/registry";
```

**Prerequisite:** `@bhavya/runtime` must export `./registry` subpath. Check `packages/runtime/package.json` exports field.

### Migration 7: Safe Expression Evaluator

**Type:** Refactor
**Risk:** MEDIUM

**Before (workflow-engine.ts:435-438):**

```typescript
const func = new Function(
  ...Object.keys(execution.variables),
  `return ${condition}`,
);
return func(...Object.values(execution.variables));
```

**After:**

```typescript
import { evaluateCondition } from "../utils/condition-evaluator";
return evaluateCondition(condition, execution.variables);
```

**New file:** `packages/runtime/src/utils/condition-evaluator.ts`

- Parse simple conditions: `variable operator value`
- Support operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`, `startsWith`
- Reject any code execution
- Throw on invalid conditions

### Migration 8: Auth Guard

**Type:** New file
**Risk:** LOW

**New file:** `apps/knowledge-studio/src/lib/auth-guard.ts`

```typescript
import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
```

**Migration:** Update all 7 unprotected routes to use `requireAuth()`.

### Migration 9: Shared Components

**Type:** New files
**Risk:** LOW

**New files:**

- `apps/knowledge-studio/src/components/page-shell.tsx`
- `apps/knowledge-studio/src/components/stat-card.tsx`
- `apps/knowledge-studio/src/components/status-badge.tsx`
- `apps/knowledge-studio/src/components/loading-state.tsx`
- `apps/knowledge-studio/src/components/error-state.tsx`

**Migration:** Update all 9 page files to use shared components. This is a refactor — no visual changes.

### Migration 10: API Response Types

**Type:** New file
**Risk:** LOW

**New file:** `apps/knowledge-studio/src/types/api.ts`

```typescript
export interface KnowledgeObject {
  id: string;
  title: string; /* ... */
}
export interface KnowledgePackage {
  id: string;
  title: string; /* ... */
}
export interface Artifact {
  id: string;
  type: string; /* ... */
}
export interface PipelineExecution {
  id: string;
  goal: string; /* ... */
}
// ... all API response types
```

**Migration:** Replace all `any` types in page files with these interfaces.

---

## Migration Order

```
1. Database indexes (Migration 1) — no dependencies
2. Environment variables (Migration 4) — no dependencies
3. Package dependencies (Migration 5) — no dependencies
4. BEE import (Migration 6) — depends on Migration 5
5. Auth guard (Migration 8) — depends on Migration 4
6. Safe evaluator (Migration 7) — no dependencies
7. API response types (Migration 10) — no dependencies
8. Shared components (Migration 9) — depends on Migration 10
9. Code migrations in pages — depends on Migration 9
```

---

## Rollback Procedures

### Database Rollback

- Indexes: `DROP INDEX IF EXISTS idx_xxx` for each
- Schema changes: Not applicable (no schema changes in this sprint)

### Code Rollback

- All changes are in git
- `git revert <commit>` for any individual change
- `git checkout .` to undo all uncommitted changes

### Configuration Rollback

- Remove new environment variables from `.env` files
- Revert package.json changes
- Run `pnpm install`

---

## Testing Migrations

After each migration:

1. Run `pnpm build` for affected packages
2. Run `pnpm test` for affected packages
3. Manual smoke test of affected functionality
4. Verify no TypeScript errors
5. Verify no ESLint errors
