export interface AppManifest {
  id: string;
  name: string;
  version: string;
  owner: string;
  mission: string;
  visibility: "public" | "internal";
  dependencies: string[];
}
