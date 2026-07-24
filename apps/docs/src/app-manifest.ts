import type { AppManifest } from "@bhavya/mission-runtime";

export const appManifest: AppManifest = {
  id: "docs",
  name: "Knowledge Platform",
  version: "0.5.0",
  owner: "Documentation",
  mission: "Knowledge",
  visibility: "public",
  dependencies: ["@bhavya/mission-runtime"]
};
