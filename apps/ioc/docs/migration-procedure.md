# Adding a migration to the IOC app

**Applies to:** `apps/ioc` and `packages/database/migrations/ioc/`

IOC mirrors its migrations inside the app (`apps/ioc/src/lib/db.ts`) so that initialization can be
synchronous — `better-sqlite3` has no asynchronous surface, and the shared runner in
`@bhavya/database/migrate` is asynchronous because it loads the migration files with a dynamic
import.

The mirror is only safe while it cannot drift, and the drift is caught by a specification. Adding a
migration therefore has a fixed procedure. **Skipping a step fails the build**, which is the point.

---

## 1. Write the migration

Create `packages/database/migrations/ioc/00N_<name>.ts` following the existing shape:

```ts
import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "00N_<name>",
  name: "<human readable name>",
  up: `...`,
  down: `...`,
};
```

Rules that matter:

- The `up` SQL must be idempotent where it can be (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF
  NOT EXISTS`). The runner applies each migration exactly once, but a database that was initialised
  by the other engine must still recognise the migration as applied.
- The `down` SQL must exist. It is used by the checksum and by a rollback.
- Never edit a migration that has been applied anywhere. The checksum changes, and the app refuses to
  run against a database that recorded the old one.

## 2. Mirror it in the app

Add the migration to `IOC_MIGRATIONS` in `apps/ioc/src/lib/db.ts`:

```ts
{
  id: "ioc/00N_<name>",
  name: "00N_<name>",
  source: "00N_<name>.ts",
  up: `...the up SQL, byte for byte...`,
  down: `...the down SQL, byte for byte...`,
}
```

- `source` is the file name inside `packages/database/migrations/ioc/`. It is what the governance
  specification matches on, and it is what makes an unmapped file detectable.
- `up` and `down` must be **byte for byte** the text in the migration file.
- The order of the array is the order of application, and it must match the file order.

The SQL text must not contain a backtick, because it is embedded in a template literal.

## 3. Let the specifications check the work

```
pnpm --filter @bhavya/app-ioc test
```

`src/lib/__tests__/db-migration-governance.spec.ts` fails when:

- a migration file exists with no mirrored counterpart (**missing**);
- a mirrored migration has no file (**extra**);
- a mirror's SQL differs from its file (**mismatched**);
- a mirrored migration's id or checksum differs from what the shared runner records;
- the mirrors are not in file order.

`src/lib/__tests__/db-apply-safety.spec.ts` checks the behaviour the mirror has to keep: a failure
leaves no partial state, a second initialiser does not fight the first, and a tampered ledger
checksum stops the run.

## 4. Check the other engines

The same migration file is picked up by the shared runner, which serves the other applications. Run
the database package's own tests and make sure the migration applies cleanly to a scratch database:

```
pnpm --filter @bhavya/database test
```

## 5. What the app does at runtime

`getDb()` calls `applyMigrationsSync()`, which:

1. creates the `_migrations` ledger if it is missing;
2. for each mirrored migration, takes the write lock (`IMMEDIATE`), re-reads the ledger inside the
   lock, and either verifies the recorded checksum, applies the migration together with its ledger
   row in one transaction, or skips it because it is already applied.

A migration is therefore applied exactly once, atomically, and two processes initialising the same
database cannot both apply it.

---

## Migrations that belong to other applications

`packages/database/migrations/` holds one directory per application: `ai-institute` (7 files),
`github-os` (3), `ioc` (2), `social-os` (2). A migration for one application is not applied by
another application's bootstrap. `ai-institute/007_content_os_core_entities.ts`, for example, is an
ai-institute migration and has nothing to do with IOC.
