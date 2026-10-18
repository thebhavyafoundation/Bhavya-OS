# Handoff — OpenNext deploy-path blocker

Date: 2026-10-19
Branch in flight: `workaround/pre-esbuild-conditional-exports` @ `3ef39d85`
`master`: `197f31e9` — **unmodified by this investigation**
Production: healthy, byte-identical to the `3b715c7a` baseline

---

## 1. The one-line problem

Cloudflare deploy fails at the OpenNext build:

```
.open-next/server-functions/default/node_modules/.pnpm/@libsql+hrana-client@0.10.0/
  node_modules/@libsql/hrana-client/lib-cjs/index.js:18:32:
  ERROR: Could not resolve "@libsql/isomorphic-ws"
```

`hrana-client` requires it unconditionally at `lib-cjs/index.js:18`.

---

## 2. Read this before anything else

**The verification gate was broken for most of this investigation's history.**

`opennext-build-verify.yml` ran the build piped to `tee` with no `set -o pipefail`.
The step exited `0` regardless of build outcome. Fixed in #44.

Any result — including results you may find in older PR descriptions — obtained
from that gate before `197f31e9` carries **no information**. Roughly a dozen
interventions were "verified" against it and were wrong.

If you add a gate, assert on files, not on exit codes.

---

## 3. Confirmed by direct filesystem evidence

Diagnostic runs `39155731571` and `39159814499`; artefacts captured the actual
`.next` and `.open-next` trees.

| File           | `.next/standalone` | `.open-next/server-functions` |
| -------------- | ------------------ | ----------------------------- |
| `package.json` | present            | present                       |
| `node.cjs`     | present            | present                       |
| `node.mjs`     | **absent**         | **absent**                    |
| `web.cjs`      | **absent**         | **absent**                    |
| `web.mjs`      | **absent**         | **absent**                    |

Also confirmed:

- The sibling symlink resolves:
  `.pnpm/@libsql+hrana-client@0.10.0/node_modules/@libsql/isomorphic-ws`
  `-> ../../../@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws`
- Source `node_modules` contains all four files.
- `@libsql/isomorphic-ws@0.1.5` exports map selects `web.cjs` under
  `workerd`, `bun`, `deno` and `default`; `node.cjs` only under `node`.
- `installDependencies` runs **after** bundling —
  `createServerBundle.js:198` esbuild, `:221` install. It cannot affect resolution.
- CLI option is `--skipNextBuild` (aliases `--skipBuild`, `-s`; env
  `SKIP_NEXT_APP_BUILD`), declared at
  `@opennextjs/cloudflare/dist/cli/commands/build.js:49`.

---

## 4. Disproven — do not retry

| Attempt                                             | Why it cannot work                                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `serverExternalPackages`                            | Honoured by Next's bundler; never reaches OpenNext's esbuild                            |
| `outputFileTracingIncludes` `/**/*`                 | Did not add conditional-export targets                                                  |
| Exact file globs for `web.cjs`/`web.mjs`/`node.mjs` | Same. Run `39157210707`: `store.isomorphicWsHasWebCjs = NO`                             |
| `node-linker=hoisted`                               | Layout was already correct                                                              |
| Direct dep on `@bhavya/database`                    | `hrana-client` is required by `@libsql/client`; pnpm placed it beside the wrong package |
| `default.install`                                   | Post-bundle (L221 after L198)                                                           |
| Post-build copy                                     | Build fails before any post step runs                                                   |
| `edgeExternals`                                     | Breaks the Next.js build in this adapter version                                        |
| Adding `opennext.config.ts` alone                   | Insufficient                                                                            |

---

## 5. BLOCKER — resolve before anything else

**`.next/standalone` appears not to exist.**

Run `39159814499` reported `stageA.nextStandaloneRoot.exists = YES`.
Run `39161895506` (after the harness fix) reports, from a complete `.next`:

```
entries: BUILD_ID, ..., next-server.js.nft.json, package.json, server,
         static, trace, types
standaloneOutputEnabled = standalone     (next.config.mjs declares it)
FATAL: .next/standalone is absent
```

Both cannot be true for the same build command. Three possibilities:

1. The earlier `stageA` probe was wrong.
2. This build genuinely did not emit standalone output (mode/turbo/env difference).
3. **OpenNext copies `.pnpm/` from somewhere other than `.next/standalone`** —
   in which case the two-stage model above, and the premise of
   `materialise-conditional-exports.mjs`, are both wrong.

Possibility 3 is the one that invalidates the current approach. Settle it first:

```bash
# in a workflow that runs the repo's real next build
ls apps/ai-institute/.next/ | head -30
find apps/ai-institute -maxdepth 4 -type d -name standalone -not -path '*/node_modules/*'
find apps/ai-institute -maxdepth 6 -type d -name '.pnpm' -not -path '*/node_modules/.pnpm'
```

If `.next/standalone` truly is absent yet `.open-next/server-functions/default/
node_modules/.pnpm/` exists, find what OpenNext actually copied from by
inspecting `dist/cli/build/open-next/createServerBundle.js` above line 198.

---

## 6. State of the in-flight workaround

**Unverified. Must not be merged.**

`apps/ai-institute/scripts/materialise-conditional-exports.mjs` copies
`web.cjs`, `web.mjs`, `node.mjs` into the standalone store between
`next build` and OpenNext, using the supported `--skipNextBuild` boundary.

It has **never** completed a full run. Two attempts failed before OpenNext ran:
first on a `process.cwd()` bug in the verifier, then on the `.next/standalone`
question above.

Files:

- `apps/ai-institute/scripts/materialise-conditional-exports.mjs`
- `apps/ai-institute/scripts/verify-conditional-export-workaround.mjs`
  (resolves the app from `import.meta.url`, **not** `cwd` — keep it that way)
- `.github/workflows/opennext-workaround-test.yml` (diagnostic only)

---

## 7. Repo / branch / PR map

| Ref                                          | State           | Purpose                       |
| -------------------------------------------- | --------------- | ----------------------------- |
| `master` `197f31e9`                          | merged          | #40 deploy gate, #44 pipefail |
| `investigate/opennext-install-deps`          | open, #46       | diagnostic record — keep      |
| `experiment/conditional-export-globs`        | **closed**, #47 | negative result               |
| `investigate/copy-phase-split`               | open, #48       | Stage A/B split evidence      |
| `workaround/pre-esbuild-conditional-exports` | open, #49       | unverified workaround         |

Shipped and worth keeping: deploy has `needs: build`; the verify gate has
`pipefail`.

---

## 8. Incident records

- `docs/incidents/next-conditional-export-tracing.md` — full evidence, versions,
  failure matrix, why prior approaches failed
- `docs/releases/opennext-install-deps-trace.md` — adapter call chain
- `docs/releases/opennext-libsql-incident.md` — earlier, on `fix/opennext-libsql-bundle`

---

## 9. Not started

- Minimal standalone reproduction fixture (needed for an upstream issue)
- Next.js version matrix
- Upstream Next.js issue — **not published**; do not claim it exists
- Any OpenNext upgrade experiment — not authorised, and Stage A shows it is not
  the primary remedy

---

## 10. Safety state — unchanged throughout

Production changed **NO** · deploy **NO** · Cloudflare upload **NO** · Turso **NO**
· migration **NO** · secrets **NO** · master modified **NO** · `.next` or
`.open-next` committed **NO**

Nothing in this investigation is merged except #40 and #44, and neither affects
production output.

---

## 11. Traps

- **Do not trust a green build gate that pipes to `tee`.** Assert on files.
- **Do not trust a green gate to mean "will deploy".** It does not; only the
  real OpenNext build does, and only with `pipefail`.
- **Do not add another glob.** Two independent disproval rounds.
- **`process.cwd()` in CI scripts is a bug source.** Two hours lost to it.
- **Do not claim the incident resolved** until `npx opennextjs-cloudflare build`
  passes on the exact production path.
- Deploys trigger on push to `master`. Merging a build-fix PR will attempt a
  deploy; `needs: build` now prevents any upload on failure, but the run will go
  red.
