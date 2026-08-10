import type { AppManifest } from "@bhavya/mission-runtime";

export const appManifest: AppManifest = {
  id: "forest",
  name: "Forest & Nature",
  version: "0.5.0",
  owner: "Forest Team",
  mission: "Nature",
  visibility: "public",
  dependencies: ["@bhavya/mission-runtime", "@bhavya/maps"]
};
