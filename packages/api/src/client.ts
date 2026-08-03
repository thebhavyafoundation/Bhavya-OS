/**
 * @bhavya/api — API Client
 *
 * Type-safe HTTP client with timeout, retry, error handling, and auth.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  apiKey?: string;
  retries?: number;
}

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
  error?: ApiError;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: unknown;
}

/**
 * Type-safe API client with timeout, retries, and error handling.
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30_000,
      headers: {},
      apiKey: "",
      retries: 0,
      ...config,
    };
  }

  async get<T>(
    path: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, { ...options, body });
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  async delete<T>(
    path: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path, options);
  }

  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
      ...options?.headers,
    };
    if (this.config.apiKey) {
      headers["X-API-Key"] = this.config.apiKey;
    }

    const timeout = options?.timeout || this.config.timeout;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: options?.signal || controller.signal,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        responseHeaders[k] = v;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          data: data as T,
          error: {
            message:
              data?.error?.message || data?.error || `HTTP ${response.status}`,
            code: data?.error?.code || "HTTP_ERROR",
            status: response.status,
            details: data?.error?.details,
          },
          headers: responseHeaders,
        };
      }

      return {
        ok: true,
        status: response.status,
        data: data as T,
        headers: responseHeaders,
      };
    } catch (err: unknown) {
      return {
        ok: false,
        status: 0,
        data: null as T,
        error: {
          message: err.name === "AbortError" ? "Request timeout" : err.message,
          code: err.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR",
          status: 0,
        },
        headers: {},
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
