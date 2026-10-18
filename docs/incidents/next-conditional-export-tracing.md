# Incident: Next.js standalone tracing drops conditional-export targets

Date opened: 2026-10-18
Classification: **NEXT.JS OUTPUT-TRACING LIMITATION CONFIRMED**
Status: workaround under evaluation, **not resolved**

## Exact versions

| Component                | Version         |
| ------------------------ | --------------- |
| Next.js                  | `15.5.25`       |
| `@opennextjs/cloudflare` | `1.20.6`        |
| `@libsql/hrana-client`   | `0.10.0`        |
| `@libsql/isomorphic-ws`  | `0.1.5`         |
| `@libsql/client`         | `0.17.4`        |
| pnpm                     | `10.17.1`       |
| Wrangler                 | `^4.131.1`      |
| CI runner                | `ubuntu-latest` |

## The two-stage evidence

Diagnostic run `39159814499`, branch `investigate/copy-phase-split` @ `3079412f`.
Artefact: `opennext-diagnose-tree.zip`.

| File           | `.next/standalone` (Stage A) | `.open-next/server-functions` (Stage B) |
| -------------- | ---------------------------- | --------------------------------------- |
| `package.json` | present                      | present                                 |
| `node.cjs`     | present                      | present                                 |
| `node.mjs`     | **absent**                   | **absent**                              |
| `web.cjs`      | **absent**                   | **absent**                              |
| `web.mjs`      | **absent**                   | **absent**                              |

Probe paths:

```
.next/standalone/node_modules/.pnpm/@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws/
.open-next/server-functions/default/node_modules/.pnpm/@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws/
```

Package sizes in the copied tree: `node.cjs` 83 b, `package.json` 1079 b.

**The loss happens in Stage A.** Stage B reproduces exactly what Stage A
provided. OpenNext's copy is faithful.

## Package exports map

`@libsql/isomorphic-ws@0.1.5`:

```json
"exports": { ".": {
  "import":  { "bun": "./web.mjs", "deno": "./web.mjs", "workerd": "./web.mjs",
               "node": "./node.mjs", "default": "./web.mjs" },
  "require": { "bun": "./web.cjs", "deno": "./web.cjs", "workerd": "./web.cjs",
               "node": "./node.cjs", "default": "./web.cjs" }
}}
```

Source `node_modules` contains all four files. The tracer emitted only `main`
(`node.cjs`). Under `workerd` and `default` the map selects `web.cjs`.

## Error

```
.open-next/server-functions/default/node_modules/.pnpm/@libsql+hrana-client@0.10.0/
  node_modules/@libsql/hrana-client/lib-cjs/index.js:18:32:
  ERROR: Could not resolve "@libsql/isomorphic-ws"
```

`hrana-client` requires it unconditionally at `lib-cjs/index.js:18`.

## Sibling symlink is not the problem

```
.pnpm/@libsql+hrana-client@0.10.0/node_modules/@libsql/isomorphic-ws
  -> ../../../@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws
  resolves: YES
```

The link is intact and resolves. Only the file set is incomplete.

## Why prior approaches failed

| Approach                                            | Stage acted on                                    | Why it failed                                  |
| --------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `serverExternalPackages`                            | Next bundler                                      | Not consulted by OpenNext's own esbuild        |
| `outputFileTracingIncludes` `/**/*`                 | Next tracing                                      | Does not add conditional-export targets        |
| Exact file globs for `web.cjs`/`web.mjs`/`node.mjs` | Next tracing                                      | Same — disproven in run `39157210707`          |
| `node-linker=hoisted`                               | install layout                                    | Layout was already correct                     |
| direct dep on `@bhavya/database`                    | dep graph                                         | `hrana-client` is required by `@libsql/client` |
| `default.install`                                   | post-bundle (`build.js:221` after esbuild `:198`) | Cannot influence bundling                      |
| post-build copy                                     | after build                                       | Build fails before it runs                     |

## Why this is not primarily an OpenNext defect

Stage A already lacks the files. OpenNext reproduces Stage A verbatim. An
OpenNext upgrade cannot restore a file that was never emitted. An OpenNext
upgrade is therefore not the primary remedy.

## Confirmed workaround boundary

`@opennextjs/cloudflare/dist/cli/build/build.js`:

```js
buildHelper.initOutputDir(options);
if (projectOpts.skipNextBuild) {
  logger.warn("Skipping Next.js build");
} else {
  setStandaloneBuildMode(options);
  buildNextjsApp(options);
}
```

`--skipNextBuild` is a supported CLI option. It clears `.open-next` but does
not touch `.next/standalone`, so a pre-esbuild boundary exists:

```
next build
  -> materialise missing conditional-export targets into .next/standalone
  -> opennextjs-cloudflare build --skip-next-build   (copies + esbuild)
```

This is a pre-esbuild materialisation at the correct boundary, not a
post-build copy. It remains **TEMPORARY** pending upstream resolution.

## Not yet done

- Minimal standalone reproduction (Stage 2)
- Next.js version matrix (Stage 3)
- Upstream issue publication (Stage 4) — **requires owner approval**
- Verification that the exact production OpenNext build passes

## Rollback

No experiment merged. `master` is `197f31e9`. Production is byte-identical to
the `3b715c7a` baseline.
