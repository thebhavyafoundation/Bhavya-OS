import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { IOC_MIGRATIONS, migrationChecksum } from "../db";
import { computeChecksum } from "@bhavya/database/migrate";

/**
 * Migration governance.
 *
 * The IOC app mirrors its migrations inline so that initialization can be
 * synchronous. A mirror is only safe while it cannot drift from its source, so
 * this specification reads the migration directory and fails when the two
 * disagree in any direction:
 *
 *   - a migration file with no mirrored counterpart (missing) — the app would
 *     run against a schema that is one migration behind;
 *   - a mirrored migration with no file (extra) — the app would create a
 *     schema the shared runner knows nothing about;
 *   - a mirror whose SQL differs from its file (mismatched) — the app and the
 *     shared runner would compute different checksums and refuse each other's
 *     databases.
 *
 * Adding a migration therefore cannot be forgotten: this specification fails.
 */

const MIGRATIONS_DIR = resolve(
  __dirname,
  "../../../../../packages/database/migrations/ioc",
);

const normalise = (text: string): string => text.replace(/\r\n/g, "\n");

function extract(source: string, key: "up" | "down"): string {
  const start = source.indexOf(`${key}:`);
  const from = source.indexOf("`", start) + 1;
  const to = source.indexOf("`", from);
  return normalise(source.slice(from, to));
}

function migrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".ts"))
    .sort();
}

describe("IOC migration governance", () => {
  it("mirrors every migration file in the directory", () => {
    const files = migrationFiles();
    const mirrored = IOC_MIGRATIONS.map((migration) => migration.source).sort();

    expect(mirrored).toEqual(files);
  });

  it("mirrors nothing that has no migration file", () => {
    for (const migration of IOC_MIGRATIONS) {
      expect(
        migrationFiles(),
        `${migration.id} has no file in packages/database/migrations/ioc`,
      ).toContain(migration.source);
    }
  });

  it("mirrors the SQL of each migration file exactly", () => {
    for (const migration of IOC_MIGRATIONS) {
      const source = readFileSync(join(MIGRATIONS_DIR, migration.source), "utf-8");

      expect(normalise(migration.up), `${migration.source} up`).toBe(
        extract(source, "up"),
      );
      expect(normalise(migration.down), `${migration.source} down`).toBe(
        extract(source, "down"),
      );
    }
  });

  it("records the ids and checksums the shared migration runner records", () => {
    for (const migration of IOC_MIGRATIONS) {
      const source = readFileSync(join(MIGRATIONS_DIR, migration.source), "utf-8");
      const shared = computeChecksum({
        id: migration.id,
        name: migration.name,
        up: extract(source, "up"),
        down: extract(source, "down"),
      });

      expect(migrationChecksum(migration), `${migration.id} checksum`).toBe(shared);
      expect(migration.id.startsWith("ioc/")).toBe(true);
    }
  });

  it("keeps the mirrored migrations in file order", () => {
    const sources = IOC_MIGRATIONS.map((migration) => migration.source);
    expect(sources).toEqual([...sources].sort());
  });
});
