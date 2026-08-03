export interface Repository {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  stars: number;
  topics: string;
  health_score: number;
  technology_score: number;
  architecture_summary: string | null;
  folder_structure: string | null;
  readme_content: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgePackage {
  id: string;
  repository_id: string | null;
  category: string;
  title: string;
  content: string;
  metadata: string;
  tags: string;
  quality_score: number;
  created_at: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string | null;
  metadata: string;
  created_at: string;
}

export interface TechnologyRadar {
  id: string;
  name: string;
  category: string;
  ring: string;
  description: string | null;
  score: number;
  metadata: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  metadata: string;
  created_at: string;
}

export type RingType = "adopt" | "trial" | "assess" | "hold";
export type Priority = "low" | "medium" | "high" | "critical";
export type RecommendationStatus =
  "pending" | "accepted" | "rejected" | "deferred";
