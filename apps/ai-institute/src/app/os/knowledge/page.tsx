import { getKnowledgeObjects, getContentDocuments } from "@/lib/os-data";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const [knowledgeObjects, contentDocs] = await Promise.all([
    getKnowledgeObjects(),
    getContentDocuments(),
  ]);

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
            Knowledge Base
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {knowledgeObjects.length} Knowledge Objects ·{" "}
          {contentDocs.length} Content Documents
        </p>
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
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-900/30 text-green-400 font-medium">
                    {ko.concepts?.length || 0} concepts
                  </span>
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
