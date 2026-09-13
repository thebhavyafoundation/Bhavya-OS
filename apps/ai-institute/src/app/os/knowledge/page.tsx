import { getContentDocuments } from "@/lib/os-data";
import { requirePolicy } from "@/lib/require-role";
import {
  listKOs,
  getKO,
  type KnowledgeObject,
} from "@/lib/knowledge-repository";
import { listEvidence, getEvidenceCounts } from "@/lib/institutional-evidence";
import { getKnowledgeMetrics } from "@/lib/knowledge-metrics";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  await requirePolicy("/os/knowledge");
  // Fetch KO summaries from canonical repository (has provenance + status)
  const koSummaries = await listKOs();

  // Fetch full KO objects for display
  const knowledgeObjects: KnowledgeObject[] = (
    await Promise.all(koSummaries.map((s) => getKO(s.id)))
  ).filter((ko): ko is KnowledgeObject => ko !== null);

  // Fetch other data in parallel
  const [contentDocs, evidence, evidenceCounts, metrics] = await Promise.all([
    getContentDocuments(),
    listEvidence(20),
    getEvidenceCounts(),
    getKnowledgeMetrics(),
  ]);

  // Compute breakdowns
  const publishedCount = koSummaries.filter(
    (ko) => ko.status === "published",
  ).length;
  const draftCount = koSummaries.filter(
    (ko) => ko.status === "draft" || !ko.status,
  ).length;
  const institutionalCount = koSummaries.filter(
    (ko) => ko.provenance === "institutional" || !ko.provenance,
  ).length;
  const testSeededCount = koSummaries.filter(
    (ko) => ko.provenance === "test-seed",
  ).length;
  const importedCount = koSummaries.filter(
    (ko) => ko.provenance === "imported",
  ).length;

  const docsByCategory = contentDocs.reduce(
    (acc, doc) => {
      const cat = doc.category || "uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, typeof contentDocs>,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Knowledge OS
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {koSummaries.length} Knowledge Objects · {contentDocs.length} Content
          Documents · {evidence.length} Evidence Records
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-2xl font-bold text-accent-gold mb-1">
            {metrics.totalKos}
          </div>
          <div className="text-xs text-text-tertiary">Total KOs</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-2xl font-bold text-accent-gold mb-1">
            {metrics.totalLessons}
          </div>
          <div className="text-xs text-text-tertiary">Lessons</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-2xl font-bold text-accent-gold mb-1">
            {metrics.totalPublications}
          </div>
          <div className="text-xs text-text-tertiary">Publications</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-2xl font-bold text-accent-gold mb-1">
            {metrics.koCreatedThisMonth}
          </div>
          <div className="text-xs text-text-tertiary">New This Month</div>
        </div>
      </div>

      {/* Publication + Provenance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Publication State
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Published</span>
              <span className="text-sm font-medium text-green-400">
                {publishedCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Draft</span>
              <span className="text-sm font-medium text-text-tertiary">
                {draftCount}
              </span>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Provenance
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Institutional</span>
              <span className="text-sm font-medium text-green-400">
                {institutionalCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Test-Seeded</span>
              <span className="text-sm font-medium text-yellow-400">
                {testSeededCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Imported</span>
              <span className="text-sm font-medium text-text-tertiary">
                {importedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Counts */}
      <div className="glass rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Evidence Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(evidenceCounts).map(([type, count]) => (
            <div
              key={type}
              className="flex justify-between items-center px-4 py-2 bg-bg-secondary rounded-lg"
            >
              <span className="text-xs text-text-secondary">{type}</span>
              <span className="text-xs font-medium text-text-primary">
                {count as number}
              </span>
            </div>
          ))}
          {Object.keys(evidenceCounts).length === 0 && (
            <div className="col-span-full text-center text-sm text-text-muted py-4">
              No evidence recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Evidence */}
      <div className="glass rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Recent Evidence
        </h2>
        {evidence.length > 0 ? (
          <div className="space-y-2">
            {evidence.slice(0, 10).map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 px-4 py-3 bg-bg-secondary rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {e.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {e.activityType} ·{" "}
                    {new Date(e.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-text-muted py-6">
            No institutional activity recorded yet
          </div>
        )}
      </div>

      {/* Knowledge Objects */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-accent-gold">🧠</span> Knowledge Objects
        </h2>
        {knowledgeObjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {knowledgeObjects.map((ko) => (
              <div
                key={ko.id}
                className="glass rounded-xl p-6 hover:border-border-secondary transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-base font-semibold text-text-primary mb-1">
                      {ko.title}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {ko.domain} · Grade {ko.grade} · {ko.subject}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                        ko.status === "published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-bg-tertiary text-text-tertiary"
                      }`}
                    >
                      {ko.status || "draft"}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-900/30 text-green-400 font-medium">
                      {ko.concepts?.length || 0} concepts
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {ko.description}
                </p>
                {ko.concepts && ko.concepts.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {ko.concepts.slice(0, 4).map((c) => (
                      <span
                        key={c.name}
                        className="text-[11px] px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary border border-border-primary"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-text-muted bg-bg-secondary border border-border-primary rounded-xl">
            No Knowledge Objects found. Add JSON files to
            bhavya-ai-lab/knowledge/objects/
          </div>
        )}
      </div>

      {/* Content Documents */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-accent-gold">📄</span> Content Documents
        </h2>
        {Object.keys(docsByCategory).length > 0 ? (
          Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category} className="mb-8">
              <h3 className="text-sm font-semibold text-text-secondary capitalize mb-3">
                {category} ({docs.length})
              </h3>
              <div className="flex flex-col gap-1">
                {docs.slice(0, 8).map((doc) => (
                  <div
                    key={doc.id}
                    className="px-4 py-3 bg-bg-secondary border border-border-primary rounded-lg flex justify-between items-center hover:border-border-secondary transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {doc.title}
                      </div>
                      {doc.summary && (
                        <div className="text-xs text-text-tertiary mt-0.5">
                          {doc.summary.slice(0, 100)}...
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {doc.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          doc.status === "published"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-bg-tertiary text-text-tertiary"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {docs.length > 8 && (
                  <div className="text-xs text-text-muted px-4 py-2">
                    + {docs.length - 8} more documents
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-text-muted bg-bg-secondary border border-border-primary rounded-xl">
            No content documents found. Add JSON files to content/knowledge/
          </div>
        )}
      </div>
    </div>
  );
}
