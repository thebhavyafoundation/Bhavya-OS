export type RadarQuadrant = "adopt" | "trial" | "assess" | "hold";
export type RadarRing = "leading" | "emerging" | "experimental" | "deprecated";

export interface RadarEntry {
  id: string;
  name: string;
  quadrant: RadarQuadrant;
  ring: RadarRing;
  description: string;
  category: string;
  isNew: boolean;
  changedFrom?: RadarQuadrant;
  url?: string;
  movement?: "up" | "down" | "stable";
}

export interface RadarReport {
  id: string;
  quarter: string;
  year: number;
  entries: RadarEntry[];
  newEntries: RadarEntry[];
  movedEntries: Array<{
    entry: RadarEntry;
    from: RadarQuadrant;
    to: RadarQuadrant;
  }>;
  summary: string;
  generatedAt: string;
}

export interface TrendData {
  technology: string;
  category: string;
  starsHistory: Array<{ date: string; stars: number }>;
  downloadHistory: Array<{ date: string; downloads: number }>;
  trendDirection: "rising" | "stable" | "declining";
  momentum: number;
}

export interface LandscapeReport {
  id: string;
  period: string;
  categories: LandscapeCategory[];
  highlights: string[];
  concerns: string[];
  generatedAt: string;
}

export interface LandscapeCategory {
  name: string;
  technologies: Array<{
    name: string;
    status: "leader" | "challenger" | "contender" | "experimental";
    score: number;
    change: number;
  }>;
}
