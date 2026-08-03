/**
 * @bhavya/ai — Prompt Registry
 *
 * Manages named prompt templates with versioning.
 */

import { generateId } from "@bhavya/platform";

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Registry of prompt templates.
 */
export class PromptRegistry {
  private prompts = new Map<string, PromptTemplate[]>();

  /**
   * Register a prompt template.
   */
  register(
    name: string,
    template: string,
    options?: {
      version?: string;
      variables?: string[];
      metadata?: Record<string, unknown>;
    },
  ): PromptTemplate {
    const versions = this.prompts.get(name) || [];
    const existing = versions.find((v) => v.version === options?.version);
    if (existing) {
      existing.template = template;
      existing.variables = options?.variables || extractVariables(template);
      existing.metadata = options?.metadata || {};
      existing.updatedAt = new Date().toISOString();
      return existing;
    }

    const prompt: PromptTemplate = {
      id: generateId("prompt"),
      name,
      version: options?.version || `1.0.0`,
      template,
      variables: options?.variables || extractVariables(template),
      metadata: options?.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    versions.push(prompt);
    this.prompts.set(name, versions);
    return prompt;
  }

  /**
   * Get the latest version of a prompt.
   */
  get(name: string): PromptTemplate | undefined {
    const versions = this.prompts.get(name);
    return versions?.[versions.length - 1];
  }

  /**
   * Get a specific version of a prompt.
   */
  getVersion(name: string, version: string): PromptTemplate | undefined {
    return this.prompts.get(name)?.find((v) => v.version === version);
  }

  /**
   * Render a prompt with variables.
   */
  render(name: string, variables: Record<string, string>): string {
    const prompt = this.get(name);
    if (!prompt) throw new Error(`Prompt not found: ${name}`);
    let result = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }
    return result;
  }

  /**
   * List all prompt names.
   */
  list(): string[] {
    return Array.from(this.prompts.keys());
  }
}

function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}
