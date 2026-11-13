# Kernel specifications

This directory holds the kernel's executable tests.

## What the test runner collects

`packages/kernel/vitest.config.ts` collects **`src/**/*.spec.ts`** only, and
excludes `src/**/*.test.ts` explicitly. `pnpm --filter @bhavya/kernel test`
therefore runs the `*.spec.ts` files and nothing else.

The kernel's `typecheck` script typechecks the specifications as well as the
sources, through `tsconfig.spec.json` (which includes `src/**/*.spec.ts`).
The main `tsconfig.json` excludes `src/__tests__`, so the specifications need
their own configuration to be typechecked at all.

## The legacy `*.test.ts` harnesses

The kernel used to carry "custom harness" files that export a class with a
`runAll()` method instead of exporting a test suite. Each of them caught its
own assertion errors and printed a summary, so **a failing assertion was
invisible to any test runner**: the files looked like coverage and provided
none. `vitest` also treats a file with no suite as a failure, which is why
they are excluded rather than collected.

Four of them were migrated into executable specifications. The scenarios and
the expectations are the harnesses' own; only the error handling changed, so a
failed assertion now fails the suite:

| Legacy harness | Migrated to |
| --- | --- |
| `human-capital.test.ts` | `human-capital.spec.ts` |
| `mission-operations.test.ts` | `mission-operations.spec.ts` |
| `knowledge-platform.test.ts` | `knowledge-platform.spec.ts` |
| `transparency-platform.test.ts` | `transparency-platform.spec.ts` |

Three remain, because their assertions cannot be preserved as they stand — they
call kernel APIs that have since changed shape, so preserving them would mean
authoring different tests rather than migrating the same ones:

| Remaining harness | Why it is not migrated yet |
| --- | --- |
| `end-to-end.test.ts` | Builds a `Goal` without the fields the current `Goal` type requires (`name`, `status`, `kpis`, `progress`), and stores a `Memory` without the fields the current type requires. The scenario no longer describes the current planner contract. |
| `end-to-end-v3.test.ts` | Exercises the self-organising, orchestration and consensus engines through call signatures that have since changed. |
| `integration.test.ts` | Boots every kernel module. Several constructor signatures, the `MemoryType` vocabulary and the capability-matching request shape have all changed since it was written. |

**These three are not coverage.** Do not read them as evidence that the
behaviour they describe still works. Migrating them is tracked as follow-up
work; until then, the honest statement is that the boot path, the
self-organising engine and the full integration surface are untested.

## A note on the service payload type

The services in `src/services` declare their public `execute()` as
`Promise<{ success: boolean; result?: unknown }>`, but every implementation
returns its payload under a *named* field (`person`, `mission`, `resource`,
`report`, `entries`, …). The `result` property is never populated.

The migrated specifications read those payloads through
`helpers/service-payload.ts`, which names the fields once instead of casting at
every call site. Nothing in the repository consumes these services today, so
the mismatch is latent rather than a live defect; widening the public
signatures of ten services is a separate change from migrating the
specifications, and is recorded as a finding rather than folded in here.
