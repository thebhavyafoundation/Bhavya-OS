# OpenNext `installDependencies` trace

Date: 2026-10-18
Branch: `investigate/opennext-install-deps`
Base: `197f31e93f74a5addf100c1514c1cf160ed4dbc1` (#44 merge)
Adapter: `@opennextjs/cloudflare@1.20.6`, `next@15.5.25`, `wrangler@^4.131.1`

Failing command:

```
npx opennextjs-cloudflare build     # working-directory: apps/ai-institute
```

Failing run: `39146214757` (deploy), `39150954481` (gate, pipefail).
Failing job: `117744321639`. Failing path:

```
.open-next/server-functions/default/node_modules/.pnpm/@libsql+hrana-client@0.10.0/
  node_modules/@libsql/hrana-client/lib-cjs/index.js:18:32:
  ERROR: Could not resolve "@libsql/isomorphic-ws"
```

## Call path

```
createServerBundle()                 @opennextjs/cloudflare/dist/cli/build/open-next/createServerBundle.js:27
  └─ buildHelper.esbuildAsync(...)   createServerBundle.js:198   <-- BUNDLING
  └─ installDependencies(...)        createServerBundle.js:221   <-- INSTALL, 23 lines later
  └─ minifyServerBundle(...)         createServerBundle.js:223
```

Import: `createServerBundle.js:11`
`import { installDependencies } from "@opennextjs/aws/build/installDeps.js";`

## `installDependencies` implementation

`@opennextjs/aws/dist/build/installDeps.js`

```js
export function installDependencies(outputDir, installOptions) {
    try {
        if (!installOptions) {
            return;                       // silent no-op, no log emitted
        }
        const tempInstallDir = fs.mkdtempSync(...);
        logger.info(`Installing dependencies for ${name}...`);
        const installCommand =
            `npm install ${osOption} ... ${installOptions.packages.join(" ")}`;
        execSync(installCommand, { stdio: "pipe", cwd: tempInstallDir, ... });
        fs.cpSync(
            path.join(tempInstallDir, "node_modules"),
            path.join(outputDir, "node_modules"),
            { recursive: true, force: true, dereference: true }
        );
        ...
        logger.info(`Dependencies installed for ${name}`);
    } catch (e) {
        logger.error(e.toString());
        logger.error("Could not install dependencies");
    }
}
```

Three properties that matter:

1. **Undefined `installOptions` is a silent return.** No log, no artefact. An
   unset option is indistinguishable from a passing install by log inspection
   alone.
2. **It produces a flat, physical tree.** `dereference: true` means npm's
   `node_modules/@libsql/*` real directories are copied, not pnpm store
   symlinks.
3. **It is post-bundle.** See ordering above.

## Config shape expected by the installed adapter

`defineCloudflareConfig(config?: CloudflareOverrides)` —
`@opennextjs/cloudflare/dist/api/config.d.ts`. `CloudflareOverrides` contains
only `incrementalCache`, `tagCache`, `queue`, `cachePurge`.

It returns `OpenNextConfig extends AwsOpenNextConfig`. The `install` option is
declared on the AWS side:

```ts
interface InstallOptions {
  packages: string[];
  arch?;
  nodeVersion?;
  libc?;
  os?;
  additionalArgs?;
}
interface DefaultFunctionOptions<E, R> {
  minify?;
  debug?;
  override?;
  install?: InstallOptions;
}
```

`@opennextjs/aws/dist/types/open-next.d.ts:182` (`InstallOptions`),
`:228` (`install?: InstallOptions`).

Passing `default` directly to `defineCloudflareConfig` is a type error —
`'default' does not exist in type 'CloudflareOverrides'`. It must be composed
onto the return value. Importing `@opennextjs/aws/types/open-next.js` for the
type is not resolvable from `apps/ai-institute` under pnpm's strict layout.

## nodejs_compat

`nodejs_compat` is a **Wrangler runtime** flag, declared in `wrangler.jsonc`
and applied when the Worker is constructed. It has no effect on esbuild
resolution during `opennextjs-cloudflare build`. It is necessary for the
deployed Worker, irrelevant to this failure.

## Answer to the posed question

The question offered H1 (install never ran) and H2 (install ran, layout still
failed). Neither is the operative cause. The decisive fact is ordering:

> `installDependencies` is invoked at `createServerBundle.js:221`,
> **after** `esbuildAsync` at `createServerBundle.js:198`.

`install` exists to populate `node_modules` for the **runtime** of the emitted
function bundle. It cannot influence what esbuild resolves while building that
same bundle. Setting `default.install` therefore cannot fix a bundling-time
resolution error, regardless of whether it is correctly shaped.

This is confirmed empirically: commit `fd905a42` set `default.install` with the
Turso chain and the gate produced the **byte-identical** error
(run `39150954481`).

## What the error actually is

esbuild bundles **from inside the output tree**, not from source `node_modules`:

```
.open-next/server-functions/default/node_modules/.pnpm/@libsql+hrana-client@0.10.0/...
```

That tree is pnpm-shaped. Under pnpm, `hrana-client` reaches `isomorphic-ws`
only through a virtual-store sibling symlink. The copy into
`.open-next/server-functions/default/node_modules/` carries
`@libsql+hrana-client@0.10.0` but does not carry the symlink target
`@libsql+isomorphic-ws@0.1.5`, so `require("@libsql/isomorphic-ws")` at
`lib-cjs/index.js:18` resolves to nothing.

## Why every prior attempt failed

| Attempt                                | Mechanism               | Why it cannot work                                               |
| -------------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `serverExternalPackages` (#37 lineage) | Next bundler            | Never reaches OpenNext's own esbuild pass                        |
| `outputFileTracingIncludes` globs      | Next standalone tracing | Did not alter the OpenNext server-function copy                  |
| `node-linker=hoisted`                  | install layout          | Already correct; defect is in the output copy                    |
| direct dep on `@bhavya/database`       | dep graph               | `hrana-client` is required by `@libsql/client`, not that package |
| post-build copy (#36)                  | artefact copying        | Cannot run before a build succeeds                               |
| `default.install` (fd905a42)           | post-bundle install     | Runs at L221, after bundling at L198                             |

## Required side effects if a pre-bundle install had run

For reference, if a mechanism ran _before_ L198 and succeeded, these would exist
in the output tree:

```
.open-next/server-functions/default/node_modules/@libsql/isomorphic-ws/package.json
.open-next/server-functions/default/node_modules/@libsql/isomorphic-ws/node.cjs
.open-next/server-functions/default/node_modules/@libsql/isomorphic-ws/web.cjs
.open-next/server-functions/default/node_modules/@libsql/isomorphic-ws/web.mjs
.open-next/server-functions/default/node_modules/@libsql/isomorphic-ws/node.mjs
```

flat real directories, no `.pnpm` involved.

## Next step

Smallest justified fix, deferred to a later cycle pending confirmation: make
the Turso chain resolvable **before** `createServerBundle.js:198`. The
instrumentation workflow in `opennext-diagnose.yml` on this branch captures the
output tree and symlink metadata to establish which copy step drops the target.

No fix implemented in this cycle.
