#!/usr/bin/env node

/**
 * Builds the component proof fixture into dist/.
 *
 * The fixture is a browser surface for the shared components in
 * @bhavya/platform-ui. It is built the way the applications build their
 * stylesheet, so the harness exercises the same CSS pipeline the deployed
 * applications use.
 *
 * Dependency handling: this script adds nothing to the workspace. It uses
 * the tools that are already installed and pinned by the lockfile:
 *
 * - @tailwindcss/postcss is a declared devDependency of the ai-institute
 *   application. The PostCSS runtime is reached through it, so the version
 *   that processes the stylesheet is the one the application itself uses.
 * - esbuild is already in the lockfile as a dependency of tsx, which the
 *   same application declares. It is reached through that dependency so the
 *   bundler version cannot drift from the lockfile.
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
const ERROR_FILE = join(HERE, "build-error.txt");

/** Tokens a shared component reads at runtime through var(). */
const RUNTIME_TOKENS = [
  "--z-modal",
  "--z-modal-panel",
  "--color-bg-overlay",
  "--color-border-focus",
  "--ring-focus",
];

const notes = [];

function note(message) {
  notes.push(message);
  process.stdout.write(message + "\n");
}

function reportFailure(stage, error) {
  const message =
    stage + ": " + (error && error.message ? error.message : String(error));
  writeFileSync(
    ERROR_FILE,
    message + "\n\n" + ((error && error.stack) || "") + "\n\n" + notes.join("\n"),
    "utf8",
  );
  process.stderr.write("fixture build failed at " + message + "\n");
  if (process.env.GITHUB_ACTIONS === "true") {
    process.stderr.write("::error::" + message.replace(/\n/g, " "));
  }
  process.exit(1);
}

function loadCssToolchain() {
  // The plugin is a declared dependency of the application, so it resolves
  // from this file without depending on how the workspace hoists packages.
  const pluginUrl = import.meta.resolve("@tailwindcss/postcss");
  const requireFromPlugin = createRequire(pluginUrl);
  const plugin = requireFromPlugin("@tailwindcss/postcss");
  const postcss = requireFromPlugin("postcss");
  note("css toolchain: " + pluginUrl);
  return {
    postcss,
    tailwind: plugin.default ?? plugin,
  };
}

function loadEsbuild() {
  const attempts = [];
  const tryLoad = (label, run) => {
    try {
      const loaded = run();
      note("bundler: " + label);
      return loaded.default ?? loaded;
    } catch (error) {
      attempts.push(label + " -> " + error.message);
      return null;
    }
  };

  const fromTsx = tryLoad("esbuild through tsx", () =>
    createRequire(import.meta.resolve("tsx"))("esbuild"),
  );
  if (fromTsx) return fromTsx;

  const fromRoot = tryLoad("esbuild through the workspace root", () =>
    createRequire(join(REPO, "package.json"))("esbuild"),
  );
  if (fromRoot) return fromRoot;

  throw new Error(
    "esbuild could not be loaded. Attempts: " + attempts.join(" | "),
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
  const { postcss, tailwind } = loadCssToolchain();
  const source = join(HERE, "fixture.css");
  const result = await postcss([tailwind()]).process(
    readFileSync(source, "utf8"),
    {
      from: source,
      to: join(DIST, "fixture.css"),
    },
  );
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
  const esbuild = loadEsbuild();
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
  reportFailure("build", error);
});
