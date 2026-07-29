// API Client
// Connects the website to the Public API.
// No business logic — just data fetching.

export interface APIClientConfig {
  baseUrl: string;
  timeout?: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class APIClient {
  private config: APIClientConfig;

  constructor(config: APIClientConfig) {
    this.config = { timeout: 5000, ...config };
  }

  // Generic GET request
  async get<T = unknown>(service: string, action: string, params?: Record<string, unknown>): Promise<T | null> {
    try {
      const url = this.buildUrl(service, action, params);
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      const result: APIResponse<T> = await response.json();

      if (result.success) {
        return result.data ?? null;
      }

      console.error(`API Error: ${result.error}`);
      return null;
    } catch (err) {
      console.error(`API Request Failed: ${err}`);
      return null;
    }
  }

  // Build URL with query params
  private buildUrl(service: string, action: string, params?: Record<string, unknown>): string {
    const base = `${this.config.baseUrl}/api/${service}`;
    const searchParams = new URLSearchParams();
    searchParams.set('action', action);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        searchParams.set(key, String(value));
      }
    }

    return `${base}?${searchParams.toString()}`;
  }

  // Health check
  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/health`, {
        signal: AbortSignal.timeout(2000),
      });
      const result: APIResponse = await response.json();
      return result.success;
    } catch {
      return false;
    }
  }
}
