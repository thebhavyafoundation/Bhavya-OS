import type { AppManifest } from "@bhavya/mission-runtime";

export const appManifest: AppManifest = {
  id: "admin",
  name: "Engineering Dashboard",
  version: "0.5.0",
  owner: "Engineering",
  mission: "Platform",
  visibility: "internal",
  dependencies: ["@bhavya/mission-runtime"]
};
