import type { MemoryStore, ModelRouter, StructuredStore, WebResearcher, WorkflowHook } from "./types";
import type { ResearchRequest, ResearchSource, ResearchState } from "./types";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function requestJson<T>(method: "POST" | "PUT", baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${path} failed with HTTP ${response.status}: ${await response.text()}`);
  return (await response.json()) as T;
}

/** OmniRoute adapter. No provider SDK or provider-specific endpoint is used here. */
export class OmniRouteClient implements ModelRouter {
  constructor(private readonly baseUrl = process.env.OMNIROUTE_URL ?? "http://localhost:8082") {}

  async complete(prompt: string, options: { model?: string; temperature?: number } = {}): Promise<string> {
    const payload = await requestJson<{ output?: string; choices?: Array<{ message?: { content?: string } }> }>("POST",
      this.baseUrl,
      "/v1/chat/completions",
      { messages: [{ role: "user", content: prompt }], ...options },
      process.env.OMNIROUTE_API_KEY ? { authorization: `Bearer ${process.env.OMNIROUTE_API_KEY}` } : {},
    );
    const output = payload.output ?? payload.choices?.[0]?.message?.content;
    if (!output) throw new Error("OmniRoute returned no model output");
    return output;
  }
}

/** Crawl4AI service adapter. Browser automation remains behind this port. */
export class Crawl4AIClient implements WebResearcher {
  constructor(private readonly baseUrl = requiredEnv("CRAWL4AI_URL")) {}

  async search(query: string): Promise<ResearchSource[]> {
    const result = await requestJson<{ results?: Array<{ title: string; url: string; content: string }>}>("POST", this.baseUrl, "/search", { query });
    return (result.results ?? []).map((item) => ({ ...item, retrievedAt: new Date().toISOString(), source: "crawl4ai" as const }));
  }

  async fetch(url: string): Promise<ResearchSource> {
    const result = await requestJson<{ title?: string; content?: string }>("POST", this.baseUrl, "/crawl", { url });
    if (!result.content) throw new Error(`Crawl4AI returned no content for ${url}`);
    return { title: result.title ?? url, url, content: result.content, retrievedAt: new Date().toISOString(), source: "crawl4ai" };
  }
}

/** Qdrant adapter; memories are tagged with source and timestamp by contract. */
export class QdrantMemoryStore implements MemoryStore {
  constructor(private readonly baseUrl = requiredEnv("QDRANT_URL"), private readonly collection = process.env.QDRANT_COLLECTION ?? "bhavya_memory") {}

  async upsert(input: { text: string; source: string; metadata: Record<string, unknown> }): Promise<string> {
    const id = crypto.randomUUID();
    await requestJson("PUT", this.baseUrl, `/collections/${this.collection}/points`, {
      points: [{ id, vector: input.metadata.vector ?? [], payload: { text: input.text, source: input.source, timestamp: new Date().toISOString(), ...input.metadata } }],
    }, process.env.QDRANT_API_KEY ? { "api-key": process.env.QDRANT_API_KEY } : {});
    return id;
  }
}

/** Supabase REST adapter for structured research records. */
export class SupabaseResearchStore implements StructuredStore {
  constructor(private readonly baseUrl = requiredEnv("SUPABASE_URL"), private readonly apiKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY")) {}

  async saveResearch(input: { request: ResearchRequest; state: ResearchState }): Promise<void> {
    await requestJson("POST", `${this.baseUrl}/rest/v1`, "/agent_research", { request: input.request, state: input.state, created_at: new Date().toISOString() }, { apikey: this.apiKey, authorization: `Bearer ${this.apiKey}`, prefer: "return=minimal" });
  }
}

/** n8n webhook adapter for unattended workflows. */
export class N8nWebhook implements WorkflowHook {
  constructor(private readonly webhookUrl = requiredEnv("N8N_AGENT_WEBHOOK_URL")) {}
  async notify(event: string, payload: Record<string, unknown>): Promise<void> {
    await requestJson("POST", this.webhookUrl, "", { event, payload, timestamp: new Date().toISOString() });
  }
}
