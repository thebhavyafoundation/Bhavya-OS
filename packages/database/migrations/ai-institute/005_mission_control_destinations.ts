import type { Migration } from "../../src/migrate";

export const migration: Migration = {
  id: "005_mission_control_destinations",
  name: "Mission Control artifact publication destinations",
  up: `
-- Publication intent for integrated artifacts. Records WHERE an approved
-- output is meant to go — never performs publication itself. Publication
-- remains a manual, human-authorized act outside this system.
ALTER TABLE mc_artifacts ADD COLUMN destination TEXT NOT NULL DEFAULT '';
  `,
  down: `
ALTER TABLE mc_artifacts DROP COLUMN destination;
  `,
};
