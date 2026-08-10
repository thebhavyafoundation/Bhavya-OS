import Link from "next/link";
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

export default async function OSPage() {
  const data = await getHomeData();

  const recentDocs = data.contentDocs.slice(0, 5);
  const recentKO = data.knowledgeObjects.slice(0, 3);
  const recentGovernance = data.governanceDocs.slice(0, 3);
  const recentPolicies = data.policies.slice(0, 3);
  const recentDecisions: AnyRecord[] =
    data.decisions?.records?.slice(0, 5) || [];
  const graphNodes: AnyRecord[] =
    data.knowledgeGraph?.nodes?.slice(0, 6) || [];
  const runtimeComponents: [string, AnyRecord][] = data.runtime?.components
    ? Object.entries(data.runtime.components)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Institutional OS
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {data.stats.knowledgeObjects} Knowledge Objects ·{" "}
          {data.stats.contentDocuments} Documents · {data.stats.apps} Apps ·{" "}
          {data.stats.services} Services
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        <StatCard
          label="Knowledge Objects"
          value={data.stats.knowledgeObjects}
          icon={<BookOpen className="w-4 h-4" />}
          colorClass="text-green-400"
          subtitle="AI curriculum content"
        />
        <StatCard
          label="Content Documents"
          value={data.stats.contentDocuments}
          icon={<FileText className="w-4 h-4" />}
          colorClass="text-blue-400"
          subtitle="Forest, research, governance"
        />
        <StatCard
          label="Governance Docs"
          value={data.stats.governanceDocs + data.stats.policies}
          icon={<Scale className="w-4 h-4" />}
          colorClass="text-amber-400"
          subtitle="Policies & trust deed"
        />
        <StatCard
          label="System Services"
          value={data.stats.services}
          icon={<Zap className="w-4 h-4" />}
          colorClass="text-purple-400"
          subtitle="AI Gateway, Website, Docs"
        />
      </div>

      {/* Knowledge + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Section title="Knowledge Objects" icon={<Brain className="w-4 h-4" />} href="/os/knowledge">
          {recentKO.length > 0 ? (
            recentKO.map((ko) => (
              <div
                key={ko.id}
                className="px-4 py-3 border-b border-border-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-text-primary">
                  {ko.title}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {ko.domain} · Grade {ko.grade} ·{" "}
                  {ko.concepts?.length || 0} concepts
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Recent Documents" icon={<FileText className="w-4 h-4" />} href="/os/knowledge">
          {recentDocs.length > 0 ? (
            recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="px-4 py-3 border-b border-border-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-text-primary">
                  {doc.title}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {doc.category} · {doc.metadata?.source || "general"}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      {/* Runtime + Knowledge Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Section title="Runtime" icon={<Zap className="w-4 h-4" />} href="/os/runtime">
          {runtimeComponents.length > 0 ? (
            runtimeComponents.map(([key, comp]) => (
              <div
                key={key}
                className="px-4 py-3 border-b border-border-primary flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary capitalize">
                    {key.replace(/-/g, " ")}
                  </div>
                  <div className="text-xs text-text-muted">
                    {comp.description}
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Knowledge Graph" icon={<Network className="w-4 h-4" />} href="/os/knowledge">
          {graphNodes.length > 0 ? (
            graphNodes.map((node) => (
              <div
                key={node.id}
                className="px-4 py-3 border-b border-border-primary flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {node.title}
                  </div>
                  <div className="text-xs text-text-muted">
                    {node.type} · {node.owner}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    node.status === "Accepted" || node.status === "Active"
                      ? "bg-green-900/30 text-green-400"
                      : node.status === "Released"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-amber-900/30 text-amber-400"
                  }`}
                >
                  {node.status}
                </span>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      {/* Governance + Policies + Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Section title="Governance" icon={<Scale className="w-4 h-4" />} href="/os/governance">
          {recentGovernance.length > 0 ? (
            recentGovernance.map((doc) => (
              <div
                key={doc.id}
                className="px-4 py-3 border-b border-border-primary"
              >
                <div className="text-sm font-medium text-text-primary">
                  {doc.title}
                </div>
                <div className="text-xs text-text-muted">
                  {doc.type} · {doc.status}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Policies" icon={<FileText className="w-4 h-4" />} href="/os/governance">
          {recentPolicies.length > 0 ? (
            recentPolicies.map((pol) => (
              <div
                key={pol.id}
                className="px-4 py-3 border-b border-border-primary"
              >
                <div className="text-sm font-medium text-text-primary">
                  {pol.icon && (
                    <span className="mr-1.5">{pol.icon}</span>
                  )}
                  {pol.title}
                </div>
                <div className="text-xs text-text-muted">{pol.status}</div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>

        <Section title="Decisions" icon={<Brain className="w-4 h-4" />} href="/os/memory">
          {recentDecisions.length > 0 ? (
            recentDecisions.map((dec) => (
              <div
                key={dec.id}
                className="px-4 py-3 border-b border-border-primary"
              >
                <div className="text-sm font-medium text-text-primary">
                  {dec.payload?.title || dec.id}
                </div>
                <div className="text-xs text-text-muted">
                  {dec.payload?.status || "recorded"} · {dec.author}
                </div>
              </div>
            ))
          ) : (
            <EmptyRow />
          )}
        </Section>
      </div>

      {/* Builders */}
      {data.builders.length > 0 && (
        <div className="mb-12">
          <Section title="Builders" icon={<Server className="w-4 h-4" />} href="/os/runtime">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
              {data.builders.map((builder: AnyRecord) => (
                <div
                  key={builder.id}
                  className="p-4 bg-bg-primary border border-border-primary rounded-lg hover:border-border-secondary transition-colors cursor-pointer"
                >
                  <div className="text-sm font-semibold text-text-primary mb-1">
                    {builder.name}
                  </div>
                  <div className="text-xs text-text-tertiary mb-2">
                    {builder.description}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {builder.output?.slice(0, 3).map((o: string) => (
                      <span
                        key={o}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-tertiary"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Footer */}
      <div className="py-6 border-t border-border-primary text-xs text-text-muted flex justify-between">
        <span>AI Lab OS v3.0.0 · Bhavya Foundation</span>
        <span className="font-mono">
          ⌘K to search · Built for institutional intelligence
        </span>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-primary flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-accent-gold">{icon}</span>
          <span className="text-sm font-semibold text-text-primary">
            {title}
          </span>
        </div>
        <Link
          href={href}
          className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
        >
          View all →
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  colorClass,
  subtitle,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  subtitle: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={colorClass}>{icon}</span>
        <span className="text-xs text-text-tertiary">{label}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-[11px] text-text-muted mt-1">{subtitle}</div>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="px-4 py-6 text-center text-sm text-text-muted">
      No data available
    </div>
  );
}
