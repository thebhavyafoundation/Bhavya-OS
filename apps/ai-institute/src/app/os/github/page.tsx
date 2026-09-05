import { requirePolicy } from "@/lib/require-role";
import { GitBranch } from "lucide-react";

export const metadata = {
  title: "GitHub Intelligence | Bhavya Foundation",
  description: "Repository analysis, patterns, and code intelligence",
};

export default async function GitHubPage() {
  await requirePolicy("/os/github");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          GitHub Intelligence
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Repository analysis, patterns, and code intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-green-400" />
            <span className="text-xs text-text-tertiary">Repositories</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-text-tertiary">Patterns</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-text-tertiary">Commits Today</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-text-tertiary">Health Score</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">
              Repository Overview
            </span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">
            Full GitHub OS will be integrated from standalone app.
          </p>
        </div>
      </div>
    </div>
  );
}
