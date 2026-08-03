/**
 * @bhavya/ai — Context Builder
 *
 * Builds context windows for AI prompts from multiple sources.
 */

export interface ContextSource {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  relevance?: number;
}

export interface ContextWindow {
  sources: ContextSource[];
  totalTokens: number;
  truncated: boolean;
}

/**
 * Build context windows from multiple sources.
 */
export class ContextBuilder {
  private maxTokens: number;
  private sources: ContextSource[] = [];

  constructor(maxTokens = 4000) {
    this.maxTokens = maxTokens;
  }

  /**
   * Add a source to the context.
   */
  addSource(source: ContextSource) {
    this.sources.push(source);
  }

  /**
   * Build the context window, prioritizing by relevance.
   */
  build(): ContextWindow {
    const sorted = [...this.sources].sort(
      (a, b) => (b.relevance || 0) - (a.relevance || 0),
    );
    const selected: ContextSource[] = [];
    let totalTokens = 0;
    let truncated = false;

    for (const source of sorted) {
      const tokens = estimateTokens(source.content);
      if (totalTokens + tokens > this.maxTokens) {
        truncated = true;
        break;
      }
      selected.push(source);
      totalTokens += tokens;
    }

    return { sources: selected, totalTokens, truncated };
  }

  /**
   * Clear all sources.
   */
  clear() {
    this.sources = [];
  }
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
