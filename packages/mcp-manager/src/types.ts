export interface MCPServer {
  name: string;
  description: string;
  repository: string;
  website: string | null;
  documentation: string | null;
  version: string;
  license: string | null;
  language: string;
  stars: number;
  lastUpdated: string;
  tools: MCPTool[];
  resources: MCPResource[];
  prompts: MCPPrompt[];
  transport: "stdio" | "sse" | "streamable-http";
  installMethods: InstallMethod[];
  supportedClients: string[];
  status: "active" | "deprecated" | "experimental" | "broken";
  securityNotes: string;
  alternatives: string[];
  bhavyaScore: number;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments: Array<{ name: string; description: string; required: boolean }>;
}

export interface InstallMethod {
  type: "npm" | "pip" | "cargo" | "docker" | "binary" | "git";
  command: string;
  args?: string[];
}

export interface MCPAnalysis {
  server: MCPServer;
  summary: string;
  installationGuide: string;
  supportedTools: string[];
  capabilities: string[];
  useCases: string[];
  bhavyaIntegrationNotes: string;
  limitations: string[];
  alternatives: string[];
  securityNotes: string;
}
