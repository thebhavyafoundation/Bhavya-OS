// Renders opennext-diagnose/findings.json into the GitHub Actions job summary.
// Purely a formatter. Never deploys and never contacts any remote.

import fs from "node:fs";
import path from "node:path";

const p = path.resolve(process.cwd(), "opennext-diagnose", "findings.json");

console.log("\n### OpenNext install-dependency diagnosis\n");
console.log("Diagnostic only. No deploy, no credentials, no production contact.\n");

if (!fs.existsSync(p)) {
  console.log("_No findings file produced._");
  process.exit(0);
}

const findings = JSON.parse(fs.readFileSync(p, "utf8"));
console.log("| Check | Result |");
console.log("| --- | --- |");
for (const f of findings) {
  console.log(`| \`${f.check}\` | ${String(f.result).replace(/\|/g, "\\|")} |`);
}

console.log("\nVerdict hints:");
const get = (k) => findings.find((f) => f.check === k)?.result;
if (get("build.failedWithCouldNotResolve") !== "YES") {
  console.log("- Build did **not** reproduce the `Could not resolve` error.");
} else {
  console.log("- Build reproduced the `Could not resolve` error.");
}
if (get("layout.flat.isomorphic-ws.exists") === "YES") {
  console.log("- A **flat** `node_modules/@libsql/isomorphic-ws` exists. Resolution base differs from expectation.");
}
if (get("store.isomorphicWsDirCopied")?.toString().startsWith("ABSENT")) {
  console.log("- The pnpm store copy **omits** `@libsql+isomorphic-ws`. This is the mechanism: the symlink target is not carried into the output tree.");
}