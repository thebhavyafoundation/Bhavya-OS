import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import {
  getContentStats,
  getKnowledgeObjects,
  getContentDocuments,
  getGovernanceDocs,
  getPolicies,
  getDecisions,
  getRegistry,
  getRuntime,
  getBuilders,
} from "@/lib/os-data";
import {
  BookOpen,
  FileText,
  Scale,
  Zap,
  ChevronRight,
  Server,
  Brain,
  Network,
  Search,
  TreePine,
  Landmark,
  Users,
  GraduationCap,
  FlaskConical,
  Target,
  Globe,
  HeartHandshake,
  BarChart3,
  FolderOpen,
  Clock,
  ArrowRight,
  Compass,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

async function getHomeData() {
  const [
    stats,
    knowledgeObjects,
    contentDocs,
    governanceDocs,
    policies,
    decisions,
    knowledgeGraph,
    runtime,
    builders,
  ] = await Promise.all([
    getContentStats(),
    getKnowledgeObjects(),
    getContentDocuments(),
    getGovernanceDocs(),
    getPolicies(),
    getDecisions(),
    getRegistry("knowledge-graph"),
    getRuntime(),
    getBuilders(),
  ]);

  return {
    stats,
    knowledgeObjects,
    contentDocs,
    governanceDocs,
    policies,
    decisions,
    knowledgeGraph,
    runtime,
    builders,
  };
}

/* ============================================
   WORKSPACE DEFINITIONS
   ============================================ */

const workspaces = [
  {
    id: "foundation",
    label: "Foundation",
    desc: "Governance, policies, meetings",
    icon: Landmark,
    href: "/os/governance",
    color: "var(--color-accent-gold)",
  },
  {
    id: "programs",
    label: "Programs",
    desc: "Projects, tasks, milestones",
    icon: Target,
    href: "/programs",
    color: "var(--color-accent-green)",
  },
  {
    id: "forest",
    label: "Forest",
    desc: "Sites, species, monitoring",
    icon: TreePine,
    href: "/os/forest",
    color: "var(--color-accent-green)",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    desc: "Library, research, courses",
    icon: Brain,
    href: "/os/knowledge",
    color: "var(--color-accent-green)",
  },
  {
    id: "heritage",
    label: "Heritage",
    desc: "Sites, documentation",
    icon: Landmark,
    href: "/missions/heritage",
    color: "var(--color-accent-gold)",
  },
  {
    id: "community",
    label: "Community",
    desc: "People, activities, impact",
    icon: Users,
    href: "/missions/community",
    color: "var(--color-accent-green)",
  },
  {
    id: "grants",
    label: "Grants",
    desc: "Opportunities, proposals",
    icon: FileText,
    href: "/os/governance",
    color: "var(--color-accent-gold)",
  },
  {
    id: "impact",
    label: "Impact",
    desc: "Metrics, evidence, reports",
    icon: BarChart3,
    href: "/impact",
    color: "var(--color-accent-green)",
  },
  {
    id: "media",
    label: "Media",
    desc: "Content, campaigns, publications",
    icon: Globe,
    href: "/os/social",
    color: "var(--color-accent-gold)",
  },
  {
    id: "ai-lab",
    label: "AI Lab",
    desc: "Agents, tools, intelligence",
    icon: FlaskConical,
    href: "/knowledge/ai",
    color: "var(--color-accent-green)",
  },
];

/* ============================================
   OS DASHBOARD PAGE
   ============================================ */

export default async function OSPage() {
  await requirePolicy("/os");
  const data = await getHomeData();

  const recentDocs = data.contentDocs.slice(0, 5);
  const recentKO = data.knowledgeObjects.slice(0, 3);
  const recentGovernance = data.governanceDocs.slice(0, 3);
  const recentPolicies = data.policies.slice(0, 3);
  const recentDecisions: AnyRecord[] =
    data.decisions?.records?.slice(0, 5) || [];
  const graphNodes: AnyRecord[] = data.knowledgeGraph?.nodes?.slice(0, 6) || [];
  const runtimeComponents: [string, AnyRecord][] = data.runtime?.components
    ? Object.entries(data.runtime.components)
    : [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-forest-950, #0a1f1a)" }}
    >
      {/* ====== OS HEADER ====== */}
      <div
        style={{
          padding: "var(--space-8) var(--space-8) var(--space-6)",
          borderBottom: "1px solid rgba(247, 244, 236, 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-md)",
                  background:
                    "linear-gradient(135deg, var(--color-brand-gold), var(--color-brand-earth))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                  }}
                >
                  OS
                </span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Bhavya OS
                </h1>
                <p
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "rgba(247, 244, 236, 0.4)",
                  }}
                >
                  The Institutional Operating System
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "rgba(247, 244, 236, 0.5)",
                  textDecoration: "none",
                }}
              >
                Back to Bhavya
              </Link>
            </div>
          </div>

          {/* Navigation tabs */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-1)",
              marginBottom: "var(--space-6)",
            }}
          >
            {["Home", "Workspaces", "Search", "AI", "Reports"].map((tab, i) => (
              <Link
                key={tab}
                href={
                  tab === "Home" ? "/os" : tab === "Workspaces" ? "/os" : "#"
                }
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textDecoration: "none",
                  background:
                    i === 0 ? "rgba(247, 244, 236, 0.08)" : "transparent",
                  color:
                    i === 0
                      ? "var(--color-text-inverse)"
                      : "rgba(247, 244, 236, 0.5)",
                  transition: "all var(--duration-fast) ease",
                }}
              >
                {tab}
              </Link>
            ))}
          </div>

          {/* Hero text */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: "var(--space-3)",
              }}
            >
              One platform. A living knowledge base. One source of truth.
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "rgba(247, 244, 236, 0.5)",
                maxWidth: "600px",
              }}
            >
              For nature, knowledge, heritage and communities.
            </p>
          </div>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(247, 244, 236, 0.05)",
              border: "1px solid rgba(247, 244, 236, 0.1)",
              maxWidth: "600px",
            }}
          >
            <Search size={16} style={{ color: "rgba(247, 244, 236, 0.4)" }} />
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: "rgba(247, 244, 236, 0.3)",
              }}
            >
              Search programs, projects, people, documents, places...
            </span>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(247, 244, 236, 0.08)",
                fontSize: "10px",
                color: "rgba(247, 244, 236, 0.3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ====== WORKSPACE GRID ====== */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "var(--space-3)",
            }}
          >
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={ws.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-5) var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(247, 244, 236, 0.03)",
                  border: "1px solid rgba(247, 244, 236, 0.06)",
                  textDecoration: "none",
                  transition: "all var(--duration-fast) ease",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(247, 244, 236, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ws.color,
                  }}
                >
                  <ws.icon size={20} />
                </div>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                  {ws.label}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "rgba(247, 244, 236, 0.4)",
                    lineHeight: 1.4,
                  }}
                >
                  {ws.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ====== KEY METRICS ====== */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                KEY METRICS
              </h3>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "rgba(247, 244, 236, 0.4)",
                  marginTop: "var(--space-1)",
                }}
              >
                Real data. Real progress. Continuously updated.
              </p>
            </div>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "rgba(247, 244, 236, 0.3)",
              }}
            >
              Last 30 days →
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-3)",
            }}
          >
            {[
              {
                label: "Active Programs",
                value: data.stats.knowledgeObjects || "—",
                sublabel: "Across 4 missions",
                icon: Target,
                color: "var(--color-accent-green)",
              },
              {
                label: "Project Sites",
                value: data.stats.contentDocuments || "—",
                sublabel: "Field locations",
                icon: Globe,
                color: "var(--color-accent-gold)",
              },
              {
                label: "Community Partners",
                value: data.stats.apps || "—",
                sublabel: "Organizations",
                icon: Users,
                color: "var(--color-accent-green)",
              },
              {
                label: "Documents",
                value: data.stats.governanceDocs + data.stats.policies || "—",
                sublabel: "In knowledge base",
                icon: FileText,
                color: "var(--color-accent-gold)",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(247, 244, 236, 0.03)",
                  border: "1px solid rgba(247, 244, 236, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <metric.icon size={14} style={{ color: metric.color }} />
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "rgba(247, 244, 236, 0.5)",
                    }}
                  >
                    {metric.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "var(--text-3xl)",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(247, 244, 236, 0.3)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====== PROJECT LOCATIONS + RECENT ACTIVITY ====== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-6)",
            marginBottom: "var(--space-10)",
          }}
        >
          {/* Project Locations */}
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              background: "rgba(247, 244, 236, 0.03)",
              border: "1px solid rgba(247, 244, 236, 0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--space-4) var(--space-5)",
                borderBottom: "1px solid rgba(247, 244, 236, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                Project Locations
              </span>
              <Compass
                size={14}
                style={{ color: "rgba(247, 244, 236, 0.3)" }}
              />
            </div>
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(14, 56, 46, 0.2)",
                position: "relative",
              }}
            >
              {/* Map not yet implemented */}
              {/* Legend */}
              <div
                style={{
                  position: "absolute",
                  bottom: "var(--space-3)",
                  left: "var(--space-3)",
                  display: "flex",
                  gap: "var(--space-3)",
                }}
              >
                {["Forest", "Knowledge", "Heritage", "Community"].map(
                  (label) => (
                    <span
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        fontSize: "10px",
                        color: "rgba(247, 244, 236, 0.4)",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--color-accent-green)",
                        }}
                      />
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              background: "rgba(247, 244, 236, 0.03)",
              border: "1px solid rgba(247, 244, 236, 0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--space-4) var(--space-5)",
                borderBottom: "1px solid rgba(247, 244, 236, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                Recent Activity
              </span>
              <Link
                href="/os/memory"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "rgba(247, 244, 236, 0.4)",
                  textDecoration: "none",
                }}
              >
                View all →
              </Link>
            </div>
            <div>
              {recentDecisions.length > 0 ? (
                recentDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    style={{
                      padding: "var(--space-3) var(--space-5)",
                      borderBottom: "1px solid rgba(247, 244, 236, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--color-accent-green)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                      >
                        {dec.payload?.title || dec.id}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(247, 244, 236, 0.4)",
                        }}
                      >
                        {dec.author} · {dec.payload?.status || "recorded"}
                      </div>
                    </div>
                    <Clock
                      size={12}
                      style={{
                        color: "rgba(247, 244, 236, 0.2)",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                ))
              ) : (
                <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(247, 244, 236, 0.3)",
                    }}
                  >
                    No recent institutional activity.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== WORKSPACES SECTION ====== */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h3
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              WORKSPACES
            </h3>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "rgba(247, 244, 236, 0.4)",
                marginTop: "var(--space-1)",
              }}
            >
              Everything you need. In one place. Each workspace is a complete
              system — not just a page.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-3)",
            }}
          >
            {workspaces.slice(0, 9).map((ws) => (
              <Link
                key={ws.id}
                href={ws.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(247, 244, 236, 0.03)",
                  border: "1px solid rgba(247, 244, 236, 0.06)",
                  textDecoration: "none",
                  transition: "all var(--duration-fast) ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(247, 244, 236, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ws.color,
                    flexShrink: 0,
                  }}
                >
                  <ws.icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                    {ws.label}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(247, 244, 236, 0.4)",
                    }}
                  >
                    {ws.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ====== RECENT DOCUMENTS + QUOTE ====== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-6)",
            marginBottom: "var(--space-10)",
          }}
        >
          {/* Recent Documents */}
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              background: "rgba(247, 244, 236, 0.03)",
              border: "1px solid rgba(247, 244, 236, 0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--space-4) var(--space-5)",
                borderBottom: "1px solid rgba(247, 244, 236, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                  RECENT DOCUMENTS
                </span>
                <p
                  style={{
                    fontSize: "10px",
                    color: "rgba(247, 244, 236, 0.4)",
                    marginTop: "2px",
                  }}
                >
                  Continue where you left off.
                </p>
              </div>
              <Link
                href="/os/knowledge"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "rgba(247, 244, 236, 0.4)",
                  textDecoration: "none",
                }}
              >
                View all →
              </Link>
            </div>
            <div>
              {recentDocs.length > 0 ? (
                recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: "var(--space-3) var(--space-5)",
                      borderBottom: "1px solid rgba(247, 244, 236, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                    }}
                  >
                    <FileText
                      size={14}
                      style={{
                        color: "rgba(247, 244, 236, 0.3)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                      >
                        {doc.title}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(247, 244, 236, 0.4)",
                        }}
                      >
                        {doc.category} · {doc.metadata?.source || "general"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(247, 244, 236, 0.3)",
                    }}
                  >
                    No institutional documents available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quote */}
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              background: "rgba(14, 56, 46, 0.3)",
              border: "1px solid rgba(247, 244, 236, 0.06)",
              padding: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(212, 175, 55, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--color-brand-gold)",
                  }}
                >
                  &ldquo;
                </span>
              </div>
            </div>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--color-text-inverse)",
                margin: 0,
              }}
            >
              Knowledge shared today becomes the wisdom that guides tomorrow.
            </blockquote>
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-sm)",
                color: "var(--color-brand-gold)",
              }}
            >
              — Bhavya
            </p>
          </div>
        </div>

        {/* ====== DOMAIN STATUS ====== */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-3)",
            }}
          >
            {[
              {
                name: "Forest",
                status: "active",
                detail: "Infrastructure ready",
                color: "var(--color-accent-green)",
              },
              {
                name: "Knowledge",
                status: "active",
                detail: `${data.stats.knowledgeObjects} KOs`,
                color: "var(--color-accent-green)",
              },
              {
                name: "Heritage",
                status: "infrastructure-ready",
                detail: "No verified records",
                color: "var(--color-accent-gold)",
              },
              {
                name: "Community",
                status: "not-yet-active",
                detail: "No verified records",
                color: "rgba(247, 244, 236, 0.3)",
              },
            ].map((domain) => (
              <div
                key={domain.name}
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(247, 244, 236, 0.03)",
                  border: "1px solid rgba(247, 244, 236, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: domain.color,
                    }}
                  />
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                    {domain.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(247, 244, 236, 0.4)",
                    textTransform: "capitalize",
                  }}
                >
                  {domain.status.replace(/-/g, " ")}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(247, 244, 236, 0.3)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {domain.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====== FOOTER ====== */}
        <div
          style={{
            padding: "var(--space-6) 0",
            borderTop: "1px solid rgba(247, 244, 236, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--text-xs)",
            color: "rgba(247, 244, 236, 0.3)",
          }}
        >
          <span>Bhavya OS · Bhavya Foundation</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            Built for institutional intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
