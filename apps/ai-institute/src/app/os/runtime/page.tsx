import { getRuntime, getBuilders } from "@/lib/os-data";
import { Zap, Server, Workflow, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default async function RuntimePage() {
  const [runtime, builders] = await Promise.all([getRuntime(), getBuilders()]);

  const components: [string, AnyRecord][] = runtime?.components
    ? Object.entries(runtime.components)
    : [];
  const flow: string[] = runtime?.flow?.steps || [];
  const principles: string[] = runtime?.principles || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Runtime
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-green-900/30 text-green-400 font-medium">
            v{runtime?.version || "3.0.0"}
          </span>
        </div>
        <p className="text-sm text-text-tertiary">
          {runtime?.name || "Bhavya AI Lab Runtime"} — {components.length}{" "}
          components · {flow.length} flow steps
        </p>
      </div>

      {/* Components */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-gold" /> Components
        </h2>
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {components.length > 0 ? (
            components.map(([key, comp]) => (
              <div
                key={key}
                className="px-5 py-3.5 border-b border-border-primary last:border-b-0 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
                  <div>
                    <div className="text-sm font-semibold text-text-primary capitalize">
                      {key.replace(/-/g, " ")}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {comp.description}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-muted font-mono">
                  {comp.path}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-text-muted">
              No components configured
            </div>
          )}
        </div>
      </div>

      {/* Execution Flow */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-accent-gold" /> Execution Flow
        </h2>
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {flow.length > 0 ? (
            flow.map((step, i) => (
              <div
                key={i}
                className="px-5 py-3 border-b border-border-primary last:border-b-0 flex items-center gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-green-500 text-black flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="text-sm text-text-secondary">{step}</div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-text-muted">
              No flow steps defined
            </div>
          )}
        </div>
      </div>

      {/* Design Principles */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent-gold" /> Design Principles
        </h2>
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          {principles.length > 0 ? (
            principles.map((principle, i) => (
              <div
                key={i}
                className="px-5 py-3 border-b border-border-primary last:border-b-0 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <div className="text-sm text-text-secondary">{principle}</div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-text-muted">
              No principles defined
            </div>
          )}
        </div>
      </div>

      {/* Builders */}
      {builders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-accent-gold" /> Registered Builders
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {(builders as AnyRecord[]).map((builder) => (
              <div
                key={builder.id}
                className="glass rounded-xl p-5"
              >
                <div className="text-sm font-semibold text-text-primary mb-1">
                  {builder.name}
                </div>
                <div className="text-xs text-text-tertiary mb-3">
                  {builder.description}
                </div>
                {builder.output && (
                  <div className="flex gap-1 flex-wrap">
                    {builder.output.slice(0, 3).map((o: string) => (
                      <span
                        key={o}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-tertiary"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
