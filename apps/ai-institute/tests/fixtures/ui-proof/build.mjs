#!/usr/bin/env node

/**
 * Builds the component proof fixture into dist/.
 *
 * The fixture is a browser surface for the shared components in
 * @bhavya/platform-ui. It is built the way the applications build their
 * stylesheet, so the harness exercises the same CSS pipeline the deployed
 * applications use.
 *
 * Dependency handling: this script adds nothing to the workspace. It
 * resolves the tools that are already installed and pinned by the lockfile:
 *
 * - postcss and @tailwindcss/postcss are declared devDependencies of the
 *   ai-institute application.
 * - esbuild is already in the lockfile as a dependency of tsx, which the
 *   same application declares. It is resolved through that dependency so
 *   the bundler version cannot drift from the lockfile.
 *
 * Usage:
 *   node apps/ai-institute/tests/fixtures/ui-proof/build.mjs
 *
 * Exit codes: 0 = fixture built, 1 = build or token check failed.
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..", "..", "..");
const REPO = join(APP, "..", "..");
const DIST = join(HERE, "dist");

/** Tokens a shared component reads at runtime through var(). */
const RUNTIME_TOKENS = [
  "--z-modal",
  "--z-modal-panel",
  "--color-bg-overlay",
  "--color-border-focus",
  "--ring-focus",
];

function resolvePostcss() {
  const requireFrom = createRequire(
    join(APP, "node_modules", "@tailwindcss", "postcss", "package.json"),
  );
  return {
    postcss: requireFrom("postcss"),
    tailwind: requireFrom("@tailwindcss/postcss"),
  };
}

function resolveEsbuild() {
  const candidates = [
    createRequire(join(APP, "node_modules", "tsx", "package.json")),
    createRequire(join(REPO, "package.json")),
  ];
  for (const requireFrom of candidates) {
    try {
      return requireFrom("esbuild");
    } catch {
      continue;
    }
  }
  throw new Error(
    "esbuild could not be resolved from the installed workspace. " +
      "Run pnpm install before building the fixture.",
  );
}

function rootDeclarations(css) {
  const blocks = [];
  const pattern = /:root[^{]*\{/g;
  let match = pattern.exec(css);
  while (match) {
    const start = match.index + match[0].length;
    const end = css.indexOf("}", start);
    blocks.push(css.slice(start, end));
    match = pattern.exec(css);
  }
  return blocks.join("\n");
}

async function buildCss() {
  const { postcss, tailwind } = resolvePostcss();
  const source = join(HERE, "fixture.css");
  const result = await postcss([tailwind()]).process(readFileSync(source, "utf8"), {
    from: source,
    to: join(DIST, "fixture.css"),
  });
  writeFileSync(join(DIST, "fixture.css"), result.css, "utf8");

  const root = rootDeclarations(result.css);
  const missing = RUNTIME_TOKENS.filter(
    (token) => !new RegExp(`(^|;)\\s*${token}\\s*:`, "m").test(root),
  );
  if (missing.length > 0) {
    throw new Error(
      "the built fixture stylesheet does not carry the runtime tokens " +
        missing.join(", ") +
        ". A shared component that reads one of them through var() would " +
        "resolve an invalid value in the browser.",
    );
  }
  return result.css.length;
}

async function buildJs() {
  const esbuild = resolveEsbuild();
  await esbuild.build({
    absWorkingDir: HERE,
    entryPoints: [join(HERE, "fixture.tsx")],
    outfile: join(DIST, "fixture.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2020",
    jsx: "automatic",
    loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });
}

async function main() {
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  const cssLength = await buildCss();
  await buildJs();

  const html = join(HERE, "index.html");
  if (!existsSync(html)) {
    throw new Error("index.html is missing from " + HERE);
  }
  copyFileSync(html, join(DIST, "index.html"));

  const bundle = readFileSync(join(DIST, "fixture.js"), "utf8");
  process.stdout.write(
    "fixture built: dist/fixture.css (" +
      cssLength +
      " bytes), dist/fixture.js (" +
      bundle.length +
      " bytes)\n",
  );
}

main().catch((error) => {
  process.stderr.write("fixture build failed: " + error.message + "\n");
  process.exit(1);
});
