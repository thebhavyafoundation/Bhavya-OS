export type PluginPlatform =
  "vscode" | "cursor" | "opencode" | "jetbrains" | "chrome" | "firefox";

export interface Plugin {
  id: string;
  name: string;
  description: string;
  platform: PluginPlatform;
  author: string;
  version: string;
  repository: string | null;
  website: string | null;
  installs: number;
  rating: number;
  lastUpdated: string;
  categories: string[];
  tags: string[];
  openSource: boolean;
  license: string | null;
  bhavyaScore: number;
}

export interface PluginRecommendation {
  plugin: Plugin;
  level: "install" | "pilot" | "study" | "monitor" | "ignore";
  reasoning: string;
  useCases: string[];
}
