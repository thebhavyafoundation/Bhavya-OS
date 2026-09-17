// Public API
// Exposes the source of truth to other applications.
// Website, mobile apps, and third-party integrations consume from here.

export interface PublicAPIConfig {
  baseUrl: string;
  cors: boolean;
  corsOrigins?: string[];
  rateLimit: number;
  authRequired: boolean;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  version: string;
}

export interface APIEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  authRequired: boolean;
}

export class PublicAPI {
  name = "public-api";
  description = "Exposes the source of truth to other applications";
  capabilities = [
    "serve-governance",
    "serve-finance",
    "serve-projects",
    "serve-audit",
    "serve-search",
    "cors-support",
    "rate-limiting",
  ];

  private config: PublicAPIConfig;
  private endpoints: APIEndpoint[] = [];
  private requestCount = 0;
  private windowStart = Date.now();

  constructor(config: PublicAPIConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Register endpoints
    this.endpoints = [
      // Governance
      {
        path: "/api/governance/documents",
        method: "GET",
        description: "List governance documents",
        authRequired: false,
      },
      {
        path: "/api/governance/documents/:id",
        method: "GET",
        description: "Get a governance document",
        authRequired: false,
      },
      {
        path: "/api/governance/resolutions",
        method: "GET",
        description: "List resolutions",
        authRequired: false,
      },
      {
        path: "/api/governance/minutes",
        method: "GET",
        description: "List meeting minutes",
        authRequired: false,
      },

      // Finance
      {
        path: "/api/finance/budgets",
        method: "GET",
        description: "List budgets",
        authRequired: true,
      },
      {
        path: "/api/finance/grants",
        method: "GET",
        description: "List grants",
        authRequired: false,
      },
      {
        path: "/api/finance/donations",
        method: "GET",
        description: "List donations",
        authRequired: true,
      },
      {
        path: "/api/finance/reports",
        method: "GET",
        description: "List financial reports",
        authRequired: false,
      },

      // Projects
      {
        path: "/api/projects",
        method: "GET",
        description: "List projects",
        authRequired: false,
      },
      {
        path: "/api/projects/:id",
        method: "GET",
        description: "Get a project",
        authRequired: false,
      },
      {
        path: "/api/projects/:id/milestones",
        method: "GET",
        description: "Get project milestones",
        authRequired: false,
      },
      {
        path: "/api/projects/:id/impact",
        method: "GET",
        description: "Get project impact metrics",
        authRequired: false,
      },

      // Audit
      {
        path: "/api/audit/entries",
        method: "GET",
        description: "List audit entries",
        authRequired: true,
      },
      {
        path: "/api/audit/entries/:id",
        method: "GET",
        description: "Get an audit entry",
        authRequired: true,
      },

      // Search
      {
        path: "/api/search",
        method: "GET",
        description: "Search across all entities",
        authRequired: false,
      },

      // Health
      {
        path: "/api/health",
        method: "GET",
        description: "API health check",
        authRequired: false,
      },
    ];
  }

  // Handle a request
  async handleRequest(
    path: string,
    method: string,
    _body?: unknown,
  ): Promise<APIResponse> {
    // Rate limiting
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: "Rate limit exceeded",
        timestamp: new Date(),
        version: "1.0",
      };
    }

    // Find endpoint
    const endpoint = this.endpoints.find(
      (e) => e.path === path && e.method === method,
    );
    if (!endpoint) {
      return {
        success: false,
        error: "Endpoint not found",
        timestamp: new Date(),
        version: "1.0",
      };
    }

    // Auth check (simplified)
    if (endpoint.authRequired) {
      // In real implementation, would validate token
    }

    return { success: true, data: null, timestamp: new Date(), version: "1.0" };
  }

  // Get API spec
  getSpec(): { endpoints: APIEndpoint[]; config: PublicAPIConfig } {
    return { endpoints: [...this.endpoints], config: this.config };
  }

  // CORS — strict allowlist (no wildcard)
  getCORSHeaders(origin?: string): Record<string, string> {
    if (!this.config.cors) return {};
    // If allowlist configured, only return header for allowlisted origin
    const allowed =
      (this.config.corsOrigins as string[] | undefined) ||
      (process.env.CORS_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (origin && allowed.length > 0 && !allowed.includes(origin)) return {};
    if (origin && allowed.includes(origin)) {
      return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      };
    }
    // No origin or no allowlist → no CORS header (strict, not wildcard)
    if (!origin && allowed.length === 0) return {};
    return {};
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.windowStart > 60000) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    this.requestCount++;
    return this.requestCount <= this.config.rateLimit;
  }

  async shutdown(): Promise<void> {
    this.endpoints = [];
  }
}
