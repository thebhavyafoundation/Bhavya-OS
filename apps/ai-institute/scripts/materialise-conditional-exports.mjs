#!/usr/bin/env node
// TEMPORARY — pending upstream resolution of the Next.js standalone tracing
// limitation documented in docs/incidents/next-conditional-export-tracing.md.
//
// WHY THIS EXISTS
//
// Next.js output file tracing emits a package's `main` entry but does not
// retain the other conditional-export targets. For
// @libsql/isomorphic-ws@0.1.5 it emits `node.cjs` and omits `web.cjs`, which
// is the target under the `workerd` and `default` conditions. OpenNext then
// copies that incomplete tree and its esbuild pass selects `web.cjs`, which is
// not there.
//
// WHY HERE AND NOT AFTER THE BUILD
//
// `opennextjs-cloudflare build --skipNextBuild` is a supported option
// (build/build.js: `if (projectOpts.skipNextBuild) { ... } else { buildNextjsApp }`).
// It clears `.open-next` and leaves `.next/standalone` intact, so this script
// runs at the boundary that actually works: after `next build`, before
// OpenNext's copy and esbuild. A post-build copy could not help, because the
// build fails before any post step runs.
//
// SAFETY
//
// - Refuses to run unless the exact expected package structure is found.
// - Refuses to run if any expected file is already present, so it cannot
//   silently mask an upstream fix. Delete the marker to re-run.
// - Copies only the named conditional-export targets. Never deletes.
// - Verifies the destination is inside `.next/standalone`.
// - Writes a marker file recording what it did.
// - Never touches production, Turso, secrets, or `.open-next`.
//
// Remove this script once Next.js retains conditional-export targets, or an
// OpenNext upgrade compensates for incomplete standalone output.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, "..");
const REPO = path.resolve(APP, "..", "..");

const MARKER = path.join(APP, ".next", "conditional-export-materialised.json");

// package dir name inside the pnpm store -> files the workerd/default
// conditions require but tracing omits.
const TARGETS = [
  {
    dir: "@libsql+isomorphic-ws@0.1.5",
    pkg: "@libsql/isomorphic-ws",
    files: ["web.cjs", "web.mjs", "node.mjs"],
  },
];

const fail = (msg) => {
  console.error(`[materialise] FAIL: ${msg}`);
  process.exit(1);
};

if (fs.existsSync(MARKER)) {
  console.log("[materialise] already applied — marker present, nothing to do");
  process.exit(0);
}

// Locate the pnpm store copy inside .next/standalone without hardcoding a path.
const STORE = path.join(APP, ".next", "standalone", "node_modules", ".pnpm");
if (!fs.existsSync(STORE)) {
  fail(
    `${path.relative(REPO, STORE)} not found. Run "next build" before this script. ` +
      "If standalone output has moved, update STORE rather than guessing.",
  );
}

const report = { appliedAt: new Date().toISOString(), packages: [] };

for (const t of TARGETS) {
  const destDir = path.join(STORE, t.dir, "node_modules", t.pkg);
  const destPkgJson = path.join(destDir, "package.json");
  if (!fs.existsSync(destPkgJson)) {
    fail(
      `${t.dir} is not present in standalone output. The package layout changed — ` +
        "stop and re-derive TARGETS rather than adapting blindly.",
    );
  }

  const destManifest = JSON.parse(fs.readFileSync(destPkgJson, "utf8"));
  if (destManifest.name !== t.pkg) {
    fail(`expected package ${t.pkg} but found ${destManifest.name} in ${destDir}`);
  }
  const version = destManifest.version;

  // Locate the source package in the repo store, version-matched.
  const sourceBase = path.join(REPO, "node_modules", ".pnpm");
  const sourceDirName = fs
    .readdirSync(sourceBase)
    .find((d) => d.startsWith(`${t.dir.split("@")[0]}@`) && d.endsWith(`@${version}`));
  if (!sourceDirName) {
    fail(
      `no source package for ${t.pkg}@${version} under ${path.relative(REPO, sourceBase)}`,
    );
  }
  const srcDir = path.join(sourceBase, sourceDirName, "node_modules", t.pkg);

  // Confirm the source actually provides what the exports map promises.
  const srcManifest = JSON.parse(fs.readFileSync(path.join(srcDir, "package.json"), "utf8"));
  const condTarget = srcManifest?.exports?.["."]?.require?.workerd;
  if (!condTarget) {
    fail(`${t.pkg}@${version} has no require.workerd target; this script's premise changed`);
  }

  const copied = [];
  for (const f of t.files) {
    const src = path.join(srcDir, f);
    const dest = path.join(destDir, f);
    if (!fs.existsSync(src)) {
      fail(`source file missing: ${path.relative(REPO, src)}`);
    }
    if (fs.existsSync(dest)) {
      console.log(`[materialise]   ${f} already present, skipping`);
      continue;
    }
    if (!dest.startsWith(path.join(APP, ".next", "standalone"))) {
      fail(`refusing to write outside .next/standalone: ${dest}`);
    }
    fs.copyFileSync(src, dest);
    copied.push({ file: f, bytes: fs.statSync(dest).size });
    console.log(`[materialise]   copied ${f} (${copied.at(-1).bytes} b)`);
  }

  // Carry the licence file when the source publishes one.
  const licence = ["LICENSE", "LICENSE.md", "LICENCE"].find((n) =>
    fs.existsSync(path.join(srcDir, n)),
  );
  if (licence && !fs.existsSync(path.join(destDir, licence))) {
    fs.copyFileSync(path.join(srcDir, licence), path.join(destDir, licence));
    console.log(`[materialise]   copied ${licence}`);
  }

  report.packages.push({
    package: `${t.pkg}@${version}`,
    source: path.relative(REPO, srcDir),
    destination: path.relative(REPO, destDir),
    conditionTarget: condTarget,
    copied,
  });
  console.log(`[materialise] ${t.pkg}@${version}: ${copied.length} file(s) materialised`);
}

fs.writeFileSync(MARKER, JSON.stringify(report, null, 2));
console.log(`[materialise] done. marker: ${path.relative(REPO, MARKER)}`);