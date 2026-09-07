import { Suspense } from "react";
import {
  getContentDocuments,
  getGovernanceDocs,
  getPolicies,
} from "@/lib/os-data";
import { getPublicKnowledgeObjects } from "@/lib/public-projection";
import { Search } from "lucide-react";
import { SearchBrowser } from "./components/SearchBrowser";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [knowledgeObjects, contentDocs, governanceDocs, policies] =
    await Promise.all([
      Promise.resolve(getPublicKnowledgeObjects()),
      getContentDocuments(),
      getGovernanceDocs(),
      getPolicies(),
    ]);

  const searchableTypes = [
    {
      label: "Knowledge Objects",
      icon: "🧠",
      items: knowledgeObjects.map((ko) => ko.title),
    },
    {
      label: "Content Documents",
      icon: "📄",
      items: contentDocs.map((doc) => doc.title),
    },
    {
      label: "Governance Docs",
      icon: "⚖️",
      items: governanceDocs.map((doc) => doc.title),
    },
    {
      label: "Policies",
      icon: "📋",
      items: policies.map((pol) => pol.title),
    },
  ];

  const total = searchableTypes.reduce((n, t) => n + t.items.length, 0);

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
          Search across {total} institutional records
        </p>
      </div>

      <Suspense>
        <SearchBrowser sections={searchableTypes} />
      </Suspense>
    </div>
  );
}
