import fs from "fs";
import path from "path";

export interface GatewayConfig {
  baseUrl: string;
  authToken?: string;
}

export interface GenerateOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class GatewayClient {
  private config: GatewayConfig;

  constructor(config?: GatewayConfig) {
    const envUrl = process.env.ANTHROPIC_BASE_URL ?? "http://localhost:8082";
    this.config = config ?? { baseUrl: envUrl, authToken: process.env.ANTHROPIC_AUTH_TOKEN };
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/health`);
      const data = await res.json() as { status?: string };
      return data.status === "healthy";
    } catch {
      return false;
    }
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
