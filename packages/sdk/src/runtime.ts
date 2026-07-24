export interface HealthResponse {
  release: string;
  task: string;
  last_build: string;
  dirty: boolean;
}

export interface PlanRequest {
  root: string;
  goal: string;
}

export interface PlanResponse {
  goal: string;
  tasks: { id: string; description: string; capability: string; estimated_minutes: number }[];
  estimated_hours: number;
}

export class RuntimeClient {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:3100") {
    this.baseUrl = baseUrl;
  }

  async health(): Promise<HealthResponse> {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json() as Promise<HealthResponse>;
  }

  async getTask(id: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/task/${id}`);
    return res.json();
  }

  async findEntity(query: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/find/${encodeURIComponent(query)}`);
    return res.json();
  }

  async buildPlan(root: string, goal: string): Promise<PlanResponse> {
    const res = await fetch(`${this.baseUrl}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ root, goal } satisfies PlanRequest),
    });
    return res.json() as Promise<PlanResponse>;
  }

  async getStats(): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/stats`);
    return res.json();
  }

  async queryGraph(entity: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/graph/query/${encodeURIComponent(entity)}`);
    return res.json();
  }
}
