import { Network } from "lucide-react";

export const metadata = {
  title: "Knowledge Graph | Bhavya Foundation",
  description: "Navigate relationships: Policy → Standard → ADR → Release → Component → Application",
};

export default function GraphPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Knowledge Graph
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Navigate relationships: Policy → Standard → ADR → Release → Component → Application
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">Graph Visualization</span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">Knowledge graph visualization will be integrated from standalone docs app.</p>
        </div>
      </div>
    </div>
  );
}
