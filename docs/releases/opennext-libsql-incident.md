# OpenNext / libSQL bundling incident

Status: **root cause confirmed, fix implemented on a review branch, awaiting human merge.**
Owner: Bhavya OS platform. Canonical branch: `master`.

## Incident summary

Every Cloudflare deployment attempted since 2026-10-16 fails before upload at the
OpenNext bundling stage. Production has therefore not changed since the last
successful deploy of `3b715c7a` (2026-10-02), and production is verified healthy
and byte-identical to the pre-incident baseline.

A green CI run was repeatedly reported as proof that the OpenNext bundle was fine.
It was not. That false signal is part of the incident.

## Failure location

Inside `opennextjs-cloudflare build`, during esbuild bundling of the OpenNext
server function:

```
Could not resolve "@libsql/isomorphic-ws"
.open-next/server-functions/default/node_modules/.pnpm/@libsql+hrana-client@0.10.0/
  node_modules/@libsql/hrana-client/lib-cjs/index.js:18:32
```

The deploy step never runs. The build step fails first, so no upload occurs.

## Confirmed root cause

`serverExternalPackages` is applied **per package**, and the configuration was
internally inconsistent.

`apps/ai-institute/next.config.mjs` listed:

```js
serverExternalPackages: [
  "better-sqlite3",
  "@libsql/client",
  "@libsql/isomorphic-ws",
];
```

Next.js excludes server-external packages from tracing and bundling by design. The
consequence is a split:

| Package                 | In `serverExternalPackages` | Effect                   |
| ----------------------- | --------------------------- | ------------------------ |
| `@libsql/isomorphic-ws` | yes                         | excluded from the bundle |
| `@libsql/hrana-client`  | no                          | bundled                  |
| `@libsql/client`        | yes                         | excluded from the bundle |

`@libsql/hrana-client` was therefore bundled, and it requires `@libsql/isomorphic-ws`
**unconditionally** at `lib-cjs/index.js:18`. The required package had been excluded
from the bundle by configuration, so the require had nothing to resolve to.

The bundle was guaranteed to fail. It was not a missing file and not a missing
dependency declaration; it was a bundle assembled from mutually inconsistent rules.

Two secondary facts make the same mistake recur at runtime, once the build passes:

1. `@libsql/client`'s `require` export condition is **flat** — it resolves to
   `lib-cjs/node.js`, which eagerly requires `./sqlite3.js` and the native `libsql`
   NAPI addon. There is no `workerd` branch under `require`. Only the `import`
   condition has one.
2. `@libsql/client/web` (`lib-cjs/web.js`) requires only `@libsql/core/*`, `./ws.js`
   and `./http.js`. It is fetch-based and contains no native code.

So any change that causes `@libsql/client` to be bundled will pull native code into
the Worker unless the source imports the `/web` entry.

## False-fix summary

Three corrective PRs and one diagnostic PR were merged or opened against a wrong
model of the defect. Each was internally reasonable and each was inert.

| PR  | Change                                                                           | Why it could not work                                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #32 | declare `@libsql/isomorphic-ws@0.1.5` a direct dependency                        | The package was excluded from the bundle by configuration, not missing from the dependency graph. A dependency declaration cannot override `serverExternalPackages`.                    |
| #33 | `outputFileTracingIncludes` for the isomorphic-ws entry files; stronger verifier | File tracing cannot override `serverExternalPackages` either. The verifier was genuinely improved and is kept.                                                                          |
| #34 | trace `ws` as well; capture build logs                                           | Same. The log capture and verifier improvements are kept.                                                                                                                               |
| #36 | post-build copy of externals into the packaged tree                              | Structurally incapable. The copy step runs **after** the build that fails. Verified: step `OpenNext build only` failed and step `Materialise server-external packages` was **skipped**. |

The verifier passed a broken bundle three times. It watched for the presence of
`package.json` and later for a resolvable exports-map entry, but it never checked
that the bundle could actually be produced, because it only ever ran on trees that
had been produced.

Two process failures compounded this and are worth recording plainly:

- Reasoning was repeatedly trusted ahead of evidence. The error was never read for
  two consecutive cycles because GitHub suppresses most log lines in the job UI and
  artifact download requires credentials.
- The verification gate was not the command production ran. It used `pnpm exec`
  after a separate `next build`, so it exercised a different build than the one that
  failed, and it never saw the failure at all.

## Additional finding: lost commits on master

`3b715c7a`, the last deploy known to succeed, is **not an ancestor of `master`**.
Merge base is `e3cbe067`. Eleven commits reachable from `3b715c7a` are absent from
`master`:

```
3b715c7a  feat(curriculum): branded asset pipeline for K-12 modules and lessons (#21)
cd2e5c29  Phase 2: K-12 AI Curriculum Lesson Player + Turso Sync (#20)
fa9aad09  fix(database): load @libsql/client via its web entry in Workers (#19)
1e6a2995  fix(database): route multi-statement exec through executeMultiple for Turso (#18)
d05f5a52  fix(ui): measure follow-ups + coord v0.10 status record (#17)
f65513e2  feat: UI/UX professional pass
08d35ef0  fix(hero): remove duplicate legacy hero rules from master
d8601d60  fix(hero): drop legacy duplicate hero rules left by master merge
d6679188  feat: verifiable course certificates and studio photo gallery
e2f3a2c2  fix(home): remove kicker above hero heading (#12)
9371ae11  feat(home): immersive background-integrated hero (#10)
```

Two of these are database correctness fixes on the Turso production path:

- **#19** switched both `require("@libsql/client")` sites to
  `require("@libsql/client/web")` because the root entry throws
  `Neon: unsupported Linux architecture` in Workers before `createClient` runs. Its
  absence from `master` is why `serverExternalPackages` contains `@libsql/client` at
  all — it was the workaround for a problem that was never meant to reach production.
- **#18** routes multi-statement `exec` through `executeMultiple`, because
  `execute()` rejects multi-statement SQL with `SQL_MANY_STATEMENTS`.
  `apps/ai-institute/src/lib/db.ts` calls `exec(BASELINE_SCHEMA)` with a
  multi-statement script, so without #18 production database init fails at runtime
  even once the build is repaired.

`master` was rewritten or merged from a divergent base and these fixes were dropped.
Restoring the two database fixes is in scope for this incident because both sit on
the code path being repaired. The remaining nine commits are feature and UI work and
are **not** restored here; they are recorded for a separate human decision.

## Actual fix path selected

Worker-compatible libSQL pieces bundle; Node-native SQLite stays external.

1. Remove `@libsql/isomorphic-ws` and `@libsql/client` from
   `serverExternalPackages`. Keep `better-sqlite3` external — it is native,
   Node-only, and must never reach a Worker.
2. Delete `outputFileTracingIncludes`. It cannot influence externalised packages and
   is unnecessary once these packages bundle normally.
3. Import `@libsql/client/web` at both require sites, restoring #19. This is what
   makes bundling `@libsql/client` safe: the `/web` entry has no native code,
   whereas the root `require` condition resolves to the native Node build.
4. Restore #18 so multi-statement schema `exec` uses `executeMultiple`, together
   with its regression test.
5. Make the CI gate run the production OpenNext build command byte for byte, and
   surface build errors as check annotations readable without credentials.

No database layer redesign. No Turso or SQLite replacement. No adapter rewrite.

## Rollback

Every step is configuration and two one-line import changes; no migration, no data
change, no schema change.

Revert the merge commit on `master`:

```bash
git revert -m 1 <merge-sha>
git push origin master
```

That re-triggers the Cloudflare deploy workflow, which will fail at the same step as
before and therefore leave production untouched. There is no partial state to undo
because no upload occurred.

To roll back a Worker that did deploy, redeploy `3b715c7a`, the last known-good
commit, using the deploy workflow. That requires Cloudflare credentials held by the
workflow runner and a human decision; it is not performed automatically.
