import { Search } from "lucide-react";

export const metadata = {
  title: "Global Search | Bhavya Foundation",
  description: "Search across documents, standards, releases, policies, projects, and components",
};

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Global Search
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Search across documents, standards, releases, policies, projects, and components
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">Search</span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">Global search will be integrated from standalone docs app.</p>
        </div>
      </div>
    </div>
  );
}
