import { GitBranch } from "lucide-react";

export const metadata = {
  title: "Repositories | Bhavya Foundation",
  description: "Repository analysis and intelligence",
};

export default function RepositoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Repositories
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Repository analysis and intelligence
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">Repository List</span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">Repository list will be integrated from standalone GitHub OS app.</p>
        </div>
      </div>
    </div>
  );
}
