import { FileText } from "lucide-react";

export const metadata = {
  title: "Policies | Bhavya Foundation",
  description: "Institutional policies and guidelines",
};

export default function PoliciesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Policies
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Institutional policies and guidelines
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">Policy Library</span>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">Policy library will be integrated from standalone docs app.</p>
        </div>
      </div>
    </div>
  );
}
