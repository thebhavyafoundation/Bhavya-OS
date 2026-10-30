// Type declarations for the context-trim entry point.
// Allows @bhavya/agent-platform (TypeScript) to import the JavaScript module.

declare module "@bhavya/runtime/context-trim" {
  export interface CompressOptions {
    point?: string;
    policy?: {
      Floor: number;
      TopK: number;
      Context: number;
      Headers: number;
      Gap: number;
      MinChars: number;
      MinCut: number;
    };
  }

  export interface CompressResult {
    output: string;
    keptLines: number;
    removedLines: number;
    point: string;
    policy: CompressOptions["policy"];
    unchanged: boolean;
    reason: string;
  }

  export function compress(
    context: string,
    query: string,
    options?: CompressOptions,
  ): CompressResult;
  export const DefaultPoint: string;
  export const MAX_CONTEXT_BYTES: number;
  export const Points: Record<
    string,
    {
      Floor: number;
      TopK: number;
      Context: number;
      Headers: number;
      Gap: number;
      MinChars: number;
      MinCut: number;
    }
  >;
  export function byteLen(s: string): number;
}
