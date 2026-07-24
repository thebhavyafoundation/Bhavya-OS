import type { AppManifest } from "@bhavya/mission-runtime";

export const appManifest: AppManifest = {
  id: "website",
  name: "Bhavya Foundation",
  version: "0.5.0",
  owner: "Communications",
  mission: "Foundation",
  visibility: "public",
  dependencies: ["@bhavya/mission-runtime"]
};
