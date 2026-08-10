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

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "#166534", text: "#22c55e" },
  POST: { bg: "#1e3a5f", text: "#3b82f6" },
  PUT: { bg: "#78350f", text: "#f59e0b" },
  DELETE: { bg: "#7f1d1d", text: "#ef4444" },
};

export default function ApiExplorerPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🔌</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            API Explorer
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {apiEndpoints.length} available endpoints — content-core data layer
        </p>
      </div>

      {/* Base URL */}
      <div
        style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#52525b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Base URL
        </span>
        <span
          style={{ fontSize: 14, color: "#22c55e", fontFamily: "monospace" }}
        >
          http://localhost:3000
        </span>
      </div>

      {/* Endpoints */}
      <div
        style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {apiEndpoints.map((endpoint, i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderBottom:
                i < apiEndpoints.length - 1 ? "1px solid #27272a" : "none",
              display: "grid",
              gridTemplateColumns: "60px 200px 1fr 140px",
              gap: 16,
              alignItems: "center",
              transition: "background 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1c1c1f")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 4,
                background: methodColors[endpoint.method]?.bg || "#1c1c1f",
                color: methodColors[endpoint.method]?.text || "#71717a",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              {endpoint.method}
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#fafafa",
                fontFamily: "monospace",
              }}
            >
              {endpoint.path}
            </span>
            <span style={{ fontSize: 12, color: "#71717a" }}>
              {endpoint.description}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#52525b",
                fontFamily: "monospace",
              }}
            >
              → {endpoint.returns}
            </span>
          </div>
        ))}
      </div>

      {/* Data Functions */}
      <div style={{ marginTop: 48 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#fafafa",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>📦</span> Data Functions
        </h2>
        <p style={{ fontSize: 13, color: "#71717a", marginBottom: 16 }}>
          Server-side data access via{" "}
          <span style={{ fontFamily: "monospace", color: "#a1a1aa" }}>
            @/lib/data
          </span>
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {[
            "getKnowledgeObjects",
            "getContentDocuments",
            "getGovernanceDocs",
            "getPolicies",
            "getForestMissions",
            "getForestStats",
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
          ].map((fn) => (
            <div
              key={fn}
              style={{
                padding: "8px 12px",
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "monospace",
                color: "#a1a1aa",
              }}
            >
              {fn}()
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
