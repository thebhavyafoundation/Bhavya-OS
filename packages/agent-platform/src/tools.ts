/** Tool ports for the autonomous engineer layer.
 *
 * Implementations are intentionally supplied by the host runtime (MCP, HTTP,
 * or a local process). This keeps provider credentials and side effects out of
 * the workflow graph and allows OpenHands/Aider to be approval-gated.
 */

export interface OpenHandsRunner {
  run(input: { repository: string; task: string; approvalRequired: boolean }): Promise<{ summary: string; changeset?: string }>;
}

export interface PlaywrightBrowser {
  open(url: string): Promise<{ title: string; text: string; url: string }>;
}

export interface Context7Docs {
  lookup(input: { library: string; query: string }): Promise<{ title: string; content: string; url?: string }>;
}

export interface GitHubMcp {
  inspectRepository(input: { owner: string; repository: string; ref?: string }): Promise<{ defaultBranch: string; files: string[] }>;
  createBranch(input: { owner: string; repository: string; branch: string; from: string }): Promise<void>;
  proposeChanges(input: { owner: string; repository: string; branch: string; title: string; body: string }): Promise<{ url: string }>;
}

export interface Crawl4AI {
  crawl(url: string): Promise<{ title: string; markdown: string; url: string }>;
}

export interface Docling {
  ingest(input: { path: string; source: string }): Promise<{ markdown: string; metadata: Record<string, unknown> }>;
}

export interface AiderRunner {
  edit(input: { repositoryPath: string; instruction: string; approvalRequired: boolean }): Promise<{ diff: string; summary: string }>;
}

export interface AgentTooling {
  openHands: OpenHandsRunner;
  browser: PlaywrightBrowser;
  docs: Context7Docs;
  github: GitHubMcp;
  crawl4ai: Crawl4AI;
  docling: Docling;
  aider: AiderRunner;
}
