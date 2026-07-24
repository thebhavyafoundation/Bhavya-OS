import type { AppManifest } from "@bhavya/mission-runtime";

export const appManifest: AppManifest = {
  id: "library",
  name: "Digital Library",
  version: "0.5.0",
  owner: "Library Team",
  mission: "Knowledge",
  visibility: "public",
  dependencies: ["@bhavya/mission-runtime"]
};
