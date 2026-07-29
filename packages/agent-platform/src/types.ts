/** Contracts for the external systems used by Bhavya's agent platform. */

export interface ResearchRequest {
  topic: string;
  question: string;
  sourceUrls?: string[];
  metadata?: Record<string, unknown>;
}

export interface ResearchSource {
  title: string;
  url: string;
  content: string;
  retrievedAt: string;
  source: "crawl4ai" | "playwright" | "context7" | "docling";
}

export interface ResearchState {
  request: ResearchRequest;
  plan: string[];
  sources: ResearchSource[];
  synthesis: string;
  memoryId?: string;
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
}

export interface ModelRouter {
  /** Complete a prompt through OmniRoute; provider selection stays external. */
  complete(prompt: string, options?: { model?: string; temperature?: number }): Promise<string>;
}

export interface WebResearcher {
  search(query: string): Promise<ResearchSource[]>;
  fetch(url: string): Promise<ResearchSource>;
}

export interface MemoryStore {
  upsert(input: { text: string; source: string; metadata: Record<string, unknown> }): Promise<string>;
}

export interface StructuredStore {
  saveResearch(input: { request: ResearchRequest; state: ResearchState }): Promise<void>;
}

export interface WorkflowHook {
  notify(event: string, payload: Record<string, unknown>): Promise<void>;
}

export interface ResearchDependencies {
  model: ModelRouter;
  web: WebResearcher;
  memory: MemoryStore;
  structured: StructuredStore;
  workflow?: WorkflowHook;
}
