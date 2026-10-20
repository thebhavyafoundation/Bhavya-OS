# Incident: next.config.mjs exported an OpenNext config, so every Next.js option was discarded

Date opened: 2026-10-20
Classification: **REPOSITORY CONFIGURATION DEFECT**
Status: fixed on `feat/elite-web-experience` (PR #54)

## Summary

`apps/ai-institute/next.config.mjs` exported the result of
`defineCloudflareConfig(nextConfig)`. That helper builds an **OpenNext** config,
not a **Next.js** config, and it keeps only the OpenNext-specific keys. Every
Next.js option in the file was therefore silently discarded.

Next.js reported this on every build and the message was easy to overlook
between other warnings:

```
? Invalid next.config.mjs options detected:
?     Unrecognized key(s) in object: 'default', 'edgeExternals', 'cloudflare',
?     'dangerous', 'middleware'
```

The OpenNext config belongs in `open-next.config.ts`, which already held it
correctly. The two files were therefore both configuring OpenNext, and the
Next.js configuration existed only in a form that Next.js could not read.

## What each discarded option cost

| Option                      | Consequence while discarded                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outputFileTracingRoot`     | Tracing was rooted at the app directory instead of the workspace root.                                                                                                                                          |
| `outputFileTracingIncludes` | The globs resolve against the app directory, and the pnpm virtual store lives at the workspace root, so `./node_modules/.pnpm/...` matched **zero files**. The traced tree carried only a package's main entry. |
| `serverExternalPackages`    | OpenNext's `copyWorkerdPackages` read an empty external list, so it never copied a package whole and never rewrote a `package.json` to the `workerd` condition.                                                 |
| `output`                    | A plain `next build` produced no `.next/standalone` output for the tracing to land in.                                                                                                                          |
| `transpilePackages`         | Workspace packages were not transpiled.                                                                                                                                                                         |
| `images.unoptimized`        | Image optimisation was not disabled.                                                                                                                                                                            |
| `headers()`                 | `Content-Security-Policy-Report-Only`, `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` were never applied.                                                                                    |

## The failure this produced

`@libsql/isomorphic-ws@0.1.5` declares:

```json
"exports": { ".": {
  "import":  { "bun": "./web.mjs", "deno": "./web.mjs", "workerd": "./web.mjs",
               "node": "./node.mjs", "default": "./web.mjs" },
  "require": { "bun": "./web.cjs", "deno": "./web.cjs", "workerd": "./web.cjs",
               "node": "./node.cjs", "default": "./web.cjs" }
}}
```

Next.js traces a package's `main` entry but not its other conditional-export
targets. The traced tree therefore carried `node.cjs` and not `web.cjs`. OpenNext
bundles the server function with the `workerd` condition active, selects
`./web.cjs`, and fails:

```
[ERROR] Could not resolve "@libsql/isomorphic-ws"
  The module "./web.cjs" was not found on the file system:
    .../isomorphic-ws/package.json:31:19:
      31 ,         "workerd": "./web.cjs",
```

`@libsql/hrana-client` requires `@libsql/isomorphic-ws` unconditionally at
`lib-cjs/index.js:18`, so the missing entry point is fatal.

## The fix

1. `next.config.mjs` exports a Next.js config. The OpenNext config stays in
   `open-next.config.ts`.
2. The `outputFileTracingIncludes` globs point two levels up at the real pnpm
   store, and trace the Turso chain whole, which carries the `workerd` entry
   point into the traced tree.
3. The Turso chain is in `serverExternalPackages`, so OpenNext copies those
   packages whole and rewrites their `package.json` to the `workerd` condition.
4. `apps/ai-institute/scripts/materialise-conditional-exports.mjs` materialises
   any conditional-export target the traced tree still lacks, and the OpenNext
   workflows assert it is present before bundling. The OpenNext build runs with
   `--skipNextBuild` so the corrected traced output is reused.

## Why earlier attempts looked like a Next.js limitation

The tracing globs were pointed at the pnpm store from the app directory, so
they matched nothing. That made an exact-file-glob experiment look like proof
that "Next.js tracing does not add conditional-export targets", when the real
cause was that the globs never resolved. The same path-base error also made
`serverExternalPackages` appear to have no effect, because the option was
discarded before Next.js ever saw it.

## Related

- `docs/incidents/next-conditional-export-tracing.md` records the earlier
  investigation on `workaround/pre-esbuild-conditional-exports` (PR #49), which
  was built on the mis-diagnosed premise above.
- `scripts/verify-opennext-bundle.mjs` asserts that every watched runtime
  dependency resolves to a real file inside the packaged tree. It is the
  executable form of this requirement and runs in both canonical workflows.
