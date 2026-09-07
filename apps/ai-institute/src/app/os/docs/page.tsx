import { BookOpen } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";

export const metadata = {
  title: "Institutional Knowledge Platform | Bhavya Foundation",
  description:
    "Canonical source for governance, decisions, standards, and releases",
};

export default async function DocsPage() {
  await requirePolicy("/os/docs");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Institutional Knowledge Platform
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Canonical source for governance, decisions, standards, and releases
          across Bhavya Foundation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-400" />
            <span className="text-xs text-text-tertiary">Governance Docs</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">15</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Policies</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">8</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">ADRs</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">12</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-text-tertiary">Releases</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">5</div>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">
              Knowledge Base
            </span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">
            Full docs platform will be integrated from standalone docs app.
          </p>
        </div>
      </div>
    </div>
  );
}
