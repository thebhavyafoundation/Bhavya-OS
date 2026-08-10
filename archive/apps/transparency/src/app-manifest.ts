export interface AppManifest {
  id: string;
  name: string;
  version: string;
  owner: string;
  mission: string;
  visibility: string;
  dependencies: string[];
}

export const appManifest: AppManifest = {
  id: "transparency",
  name: "Transparency Portal",
  version: "0.5.0",
  owner: "Governance",
  mission: "Governance",
  visibility: "public",
  dependencies: ["@bhavya/mission-runtime"]
};
