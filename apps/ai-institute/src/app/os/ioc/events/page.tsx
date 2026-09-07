import { requirePolicy } from "@/lib/require-role";
import { getIOCEvents } from "@/lib/os-data";
import { Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Institution Events | Bhavya Foundation",
  description: "Institute of Compliance — event log and audit trail",
};

export default async function IOCEventsPage() {
  await requirePolicy("/os/ioc");
  const events = getIOCEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/os/ioc"
          className="text-xs text-accent-gold hover:underline mb-2 inline-block"
        >
          _back to IOC
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Institution Events
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {events.length} events recorded
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="divide-y divide-border-primary">
          {events.map((event) => {
            let payload: Record<string, string> = {};
            try {
              payload = JSON.parse(event.payload || "{}");
            } catch {
              /* ignore */
            }

            return (
              <div key={event.id} className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-primary">
                        {event.type}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        from {event.source}
                      </span>
                    </div>
                    {Object.keys(payload).length > 0 && (
                      <p className="text-[11px] text-text-muted mt-0.5 truncate">
                        {Object.entries(payload)
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted flex-shrink-0">
                    {new Date(event.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-text-muted">No events recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
