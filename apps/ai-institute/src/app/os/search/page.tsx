import {
  getKnowledgeObjects,
  getContentDocuments,
  getGovernanceDocs,
  getPolicies,
} from "@/lib/os-data";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [knowledgeObjects, contentDocs, governanceDocs, policies] =
    await Promise.all([
      getKnowledgeObjects(),
      getContentDocuments(),
      getGovernanceDocs(),
      getPolicies(),
    ]);

  const searchableTypes = [
    {
      label: "Knowledge Objects",
      icon: "🧠",
      count: knowledgeObjects.length,
      examples: knowledgeObjects.slice(0, 3).map((ko) => ko.title),
    },
    {
      label: "Content Documents",
      icon: "📄",
      count: contentDocs.length,
      examples: contentDocs.slice(0, 3).map((doc) => doc.title),
    },
    {
      label: "Governance Docs",
      icon: "⚖️",
      count: governanceDocs.length,
      examples: governanceDocs.slice(0, 3).map((doc) => doc.title),
    },
    {
      label: "Policies",
      icon: "📋",
      count: policies.length,
      examples: policies.slice(0, 3).map((pol) => pol.title),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Search
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          Search across{" "}
          {knowledgeObjects.length +
            contentDocs.length +
            governanceDocs.length +
            policies.length}{" "}
          institutional records
        </p>
      </div>

      {/* Search Input (placeholder) */}
      <div className="glass rounded-xl p-5 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search knowledge, documents, policies..."
            disabled
            className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-text-tertiary text-sm cursor-not-allowed outline-none"
          />
        </div>
        <div className="mt-3 text-xs text-text-muted">
          Client-side search coming soon. Currently showing all available content
          types.
        </div>
      </div>

      {/* Searchable Content Types */}
      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="text-accent-gold">📁</span> Searchable Content
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {searchableTypes.map((type) => (
          <div key={type.label} className="glass rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm font-semibold text-text-primary">
                  {type.label}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-green-900/30 text-green-400 font-medium">
                {type.count}
              </span>
            </div>
            {type.examples.length > 0 ? (
              <div className="flex flex-col gap-1 ml-7">
                {type.examples.map((example) => (
                  <div key={example} className="text-xs text-text-tertiary">
                    {example}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-text-muted ml-7">
                No items available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
