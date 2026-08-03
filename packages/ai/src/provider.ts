/**
 * @bhavya/ai — AI Provider Abstraction
 *
 * Unified interface for AI providers (OpenAI, Anthropic, local models).
 */

export interface AiProvider {
  id: string;
  name: string;
  type: AiProviderType;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  embed?(text: string): Promise<number[]>;
  health?(): Promise<ProviderHealth>;
}

export type AiProviderType = "openai" | "anthropic" | "local" | "custom";

export interface GenerateRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
}

export interface GenerateResponse {
  text: string;
  tokens: { input: number; output: number };
  model: string;
  finishReason: string;
}

export interface ProviderHealth {
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs: number;
  error?: string;
}

/**
 * Registry of AI providers.
 */
export class AiProviderRegistry {
  private providers = new Map<string, AiProvider>();

  register(provider: AiProvider) {
    this.providers.set(provider.id, provider);
  }

  get(id: string): AiProvider | undefined {
    return this.providers.get(id);
  }

  list(): AiProvider[] {
    return Array.from(this.providers.values());
  }
}
