import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { computeChecksum } from "@bhavya/database/migrate";

/**
 * The IOC app bootstraps its database with plain strings inside db.ts rather
 * than through the asynchronous migration runner, because better-sqlite3 has
 * no asynchronous surface. Duplicating SQL is only acceptable if it cannot
 * silently drift from packages/database/migrations/ioc, so this specification
 * pins the two together.
 *
 * Migration sources are read as TypeScript modules, so line endings are
 * normalised exactly as the runtime normalises them — a raw byte read would
 * reject every string on a CRLF checkout. The reference checksums recorded by
 * the migration runner (6f2879855e49c84e / 1140f0c3354d3216) are those of the
 * normalised strings and are asserted here.
 */

const migrationFiles = [
  {
    path: resolve(
      __dirname,
      "../../../../../packages/database/migrations/ioc/001_baseline_schema.ts",
    ),
    name: "001_baseline_schema",
  },
  {
    path: resolve(
      __dirname,
      "../../../../../packages/database/migrations/ioc/002_add_fk_indexes.ts",
    ),
    name: "002_add_fk_indexes",
  },
];

const normalise = (text: string) => text.replace(/\r\n/g, "\n");

function extractUp(src: string): string {
  const start = src.indexOf("up:");
  const from = src.indexOf("`", start) + 1;
  const to = src.indexOf("`", from);
  return src.slice(from, to);
}

function extractDown(src: string): string {
  const start = src.indexOf("down:");
  const from = src.indexOf("`", start) + 1;
  const to = src.indexOf("`", from);
  return src.slice(from, to);
}

const appSource = readFileSync(resolve(__dirname, "../db.ts"), "utf-8");

function stringConstant(src: string, name: string): string {
  const marker = `const ${name} = \``;
  const from = src.indexOf(marker) + marker.length;
  const to = src.indexOf("`", from);
  return src.slice(from, to);
}

describe("inline IOC migrations", () => {
  it("keeps the baseline and index migration SQL identical to the migration files", () => {
    for (const migration of migrationFiles) {
      const source = readFileSync(migration.path, "utf-8");
      const expectedUp = normalise(extractUp(source));
      const expectedDown = normalise(extractDown(source));

      const suffix = migration.name.startsWith("001") ? "BASELINE" : "FK";
      expect(stringConstant(appSource, `${suffix}_UP`)).toBe(expectedUp);
      expect(stringConstant(appSource, `${suffix}_DOWN`)).toBe(expectedDown);
    }
  });

  it("computes checksums matching the recorded migration ledger", () => {
    const baseline = {
      up: normalise(extractUp(readFileSync(migrationFiles[0].path, "utf-8"))),
      down: normalise(extractDown(readFileSync(migrationFiles[0].path, "utf-8"))),
    };
    const fk = {
      up: normalise(extractUp(readFileSync(migrationFiles[1].path, "utf-8"))),
      down: normalise(extractDown(readFileSync(migrationFiles[1].path, "utf-8"))),
    };

    expect(computeChecksum({ ...baseline, id: "ioc/001_baseline_schema", name: "001_baseline_schema" })).toBe(
      "6f2879855e49c84e",
    );
    expect(computeChecksum({ ...fk, id: "ioc/002_add_fk_indexes", name: "002_add_fk_indexes" })).toBe(
      "1140f0c3354d3216",
    );
  });
});
