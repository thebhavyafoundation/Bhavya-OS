import { requirePolicy } from "@/lib/require-role";
import { Plug } from "lucide-react";

export const dynamic = "force-dynamic";

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/knowledge",
    description: "List all Knowledge Objects",
    returns: "KnowledgeObject[]",
  },
  {
    method: "GET",
    path: "/api/content",
    description: "List all content documents",
    returns: "ContentDocument[]",
  },
  {
    method: "GET",
    path: "/api/governance",
    description: "List governance documents",
    returns: "GovernanceDoc[]",
  },
  {
    method: "GET",
    path: "/api/policies",
    description: "List institutional policies",
    returns: "Policy[]",
  },
  {
    method: "GET",
    path: "/api/forest/missions",
    description: "List forest restoration missions",
    returns: "ForestMission[]",
  },
  {
    method: "GET",
    path: "/api/forest/stats",
    description: "Get forest mission statistics",
    returns: "ForestStats",
  },
  {
    method: "GET",
    path: "/api/research",
    description: "List research projects",
    returns: "ResearchProject[]",
  },
  {
    method: "GET",
    path: "/api/projects",
    description: "List institutional projects",
    returns: "Project[]",
  },
  {
    method: "GET",
    path: "/api/memory/decisions",
    description: "List architectural decision records",
    returns: "DecisionMeta",
  },
  {
    method: "GET",
    path: "/api/registry/services",
    description: "List registered services",
    returns: "Service[]",
  },
  {
    method: "GET",
    path: "/api/registry/apps",
    description: "List registered applications",
    returns: "App[]",
  },
  {
    method: "GET",
    path: "/api/registry/knowledge-graph",
    description: "Get knowledge graph nodes and edges",
    returns: "KnowledgeGraph",
  },
  {
    method: "GET",
    path: "/api/registry/standards",
    description: "List institutional standards",
    returns: "Standards",
  },
  {
    method: "GET",
    path: "/api/registry/workflows",
    description: "List institutional workflows",
    returns: "Workflows",
  },
  {
    method: "GET",
    path: "/api/runtime",
    description: "Get runtime configuration and components",
    returns: "Runtime",
  },
  {
    method: "GET",
    path: "/api/builders",
    description: "List registered builders",
    returns: "Builder[]",
  },
  {
    method: "GET",
    path: "/api/navigation/:name",
    description: "Get navigation structure by name",
    returns: "Navigation",
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "Get aggregated content statistics",
    returns: "ContentStats",
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-900/30 text-green-400",
  POST: "bg-blue-900/30 text-blue-400",
  PUT: "bg-amber-900/30 text-amber-400",
  DELETE: "bg-red-900/30 text-red-400",
};

const dataFunctions = [
  "getKnowledgeObjects",
  "getContentDocuments",
  "getGovernanceDocs",
  "getPolicies",
  "getForestMissions",
  "getResearchProjects",
  "getProjects",
  "getDecisions",
  "getRuntime",
  "getBuilders",
  "getServices",
  "getApps",
  "getRegistry",
  "getKnowledgeGraph",
  "getStandards",
  "getWorkflows",
  "getNavigation",
  "getContentStats",
  "getMDXContent",
  "getBBLLessons",
];

export default async function ApiExplorerPage() {
  await requirePolicy("/os/api-explorer");
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Plug className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            API Explorer
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {apiEndpoints.length} available endpoints — content-core data layer
        </p>
      </div>

      {/* Base URL */}
      <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-xs text-text-muted uppercase tracking-wider">
          Base URL
        </span>
        <span className="text-sm text-green-400 font-mono">
          http://localhost:3000
        </span>
      </div>

      {/* Endpoints */}
      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        {apiEndpoints.map((endpoint, i) => (
          <div
            key={i}
            className="px-5 py-3.5 border-b border-border-primary last:border-b-0 grid grid-cols-[60px_200px_1fr_140px] gap-4 items-center hover:bg-bg-tertiary transition-colors cursor-pointer"
          >
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded text-center font-mono ${
                methodColors[endpoint.method] ||
                "bg-bg-tertiary text-text-tertiary"
              }`}
            >
              {endpoint.method}
            </span>
            <span className="text-sm text-text-primary font-mono">
              {endpoint.path}
            </span>
            <span className="text-xs text-text-tertiary">
              {endpoint.description}
            </span>
            <span className="text-[11px] text-text-muted font-mono">
              → {endpoint.returns}
            </span>
          </div>
        ))}
      </div>

      {/* Data Functions */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-accent-gold">📦</span> Data Functions
        </h2>
        <p className="text-sm text-text-tertiary mb-4">
          Server-side data access via{" "}
          <span className="font-mono text-text-secondary">@/lib/os-data</span>
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {dataFunctions.map((fn) => (
            <div
              key={fn}
              className="px-3 py-2 bg-bg-primary border border-border-primary rounded-md text-xs font-mono text-text-secondary"
            >
              {fn}()
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
