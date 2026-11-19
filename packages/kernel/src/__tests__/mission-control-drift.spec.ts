import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  JOB_STATUS_FOR_RESULT_CODE,
  type MissionControlJobStatus,
} from "../execution/mission-control-mapping.js";

import {
  MISSION_CONTROL_JOB_STATUSES,
  MISSION_CONTROL_TRANSITIONS,
} from "./helpers/mission-control-fixture.js";

// The kernel cannot import the application: the deployed application does not
// depend on the kernel, and the kernel must not depend on the application.
// The Mission Control job-status union and its transition table therefore
// have to be restated here.
//
// A restatement can drift. These specifications read the application's own
// source and compare it with the restatement, so a change on either side is
// caught rather than silently accepted.
//
// The comparison is textual on purpose: importing the application into a
// kernel specification would invert the dependency direction and would pull
// the application's runtime into the kernel's test run.

const specDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(specDir, "..", "..");
const repositoryRoot = resolve(packageRoot, "..", "..");

const statusSourcePath = resolve(
  repositoryRoot,
  "apps/ai-institute/src/lib/repositories/mission-control-repository.ts",
);
const transitionsSourcePath = resolve(
  repositoryRoot,
  "apps/ai-institute/src/lib/repositories/sqlite-mission-control-repository.ts",
);

// The kernel's own copy of the union.
const KERNEL_JOB_STATUSES: MissionControlJobStatus[] =
  MISSION_CONTROL_JOB_STATUSES;

/** Read the members of a string-literal union from a TypeScript source file. */
function readUnionMembers(source: string, typeName: string): string[] | undefined {
  const declaration = source.match(
    new RegExp(`export type ${typeName} =([^;]+);`),
  );
  if (!declaration) return undefined;
  return [...declaration[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

/** Read a table literal of the form `key: ["a", "b"]` from a source file. */
function readTransitionTable(
  source: string,
  tableName: string,
): Record<string, string[]> | undefined {
  const start = source.indexOf(tableName);
  if (start === -1) return undefined;
  const body = source.slice(start, source.indexOf("};", start));
  const table: Record<string, string[]> = {};
  for (const line of body.split("\n")) {
    const entry = line.match(/^\s*([a-z_]+):\s*\[([^\]]*)\]/);
    if (!entry) continue;
    table[entry[1]] = [...entry[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  }
  return table;
}

const statusSourceAvailable = existsSync(statusSourcePath);
const transitionsSourceAvailable = existsSync(transitionsSourcePath);

describe.skipIf(!statusSourceAvailable)(
  "mission control job-status drift guard",
  () => {
    it("matches the job statuses the application declares", () => {
      const source = readFileSync(statusSourcePath, "utf8");
      const members = readUnionMembers(source, "McJobStatus");

      expect(members).toBeDefined();
      expect([...(members ?? [])].sort()).toEqual(
        [...KERNEL_JOB_STATUSES].sort(),
      );
    });

    it("maps only onto job statuses the application declares", () => {
      const source = readFileSync(statusSourcePath, "utf8");
      const members = new Set(readUnionMembers(source, "McJobStatus") ?? []);

      for (const status of Object.values(JOB_STATUS_FOR_RESULT_CODE)) {
        expect(members.has(status)).toBe(true);
      }
    });
  },
);

describe.skipIf(!transitionsSourceAvailable)(
  "mission control transition-table drift guard",
  () => {
    it("matches the transition table the application declares", () => {
      const source = readFileSync(transitionsSourcePath, "utf8");
      const table = readTransitionTable(source, "JOB_TRANSITIONS");

      expect(table).toBeDefined();
      // The copy in the fixture is the one the mapping specifications run
      // against, so comparing it with the application's own table is what
      // keeps the two from drifting apart.
      expect(table).toEqual(MISSION_CONTROL_TRANSITIONS);
    });
  },
);
