export interface GitHubTrending {
  repository: string;
  description: string;
  language: string;
  stars: number;
  starsToday: number;
  url: string;
  period: "daily" | "weekly" | "monthly";
  fetchedAt: string;
}

export interface GitHubRelease {
  repository: string;
  tag: string;
  name: string;
  body: string;
  url: string;
  publishedAt: string;
  prerelease: boolean;
  breakingChanges: string[];
}

export interface GitHubDiscussion {
  repository: string;
  title: string;
  body: string;
  url: string;
  author: string;
  category: string;
  reactions: number;
  comments: number;
  createdAt: string;
}

export interface BreakingChange {
  repository: string;
  version: string;
  description: string;
  impact: "high" | "medium" | "low";
  migrationGuide: string | null;
  detectedAt: string;
}

export interface ArchitecturePattern {
  repository: string;
  pattern: string;
  description: string;
  files: string[];
  reusable: boolean;
  detectedAt: string;
}

export interface ReusableComponent {
  repository: string;
  name: string;
  type: "component" | "hook" | "utility" | "module";
  description: string;
  language: string;
  files: string[];
  reusable: boolean;
  detectedAt: string;
}
