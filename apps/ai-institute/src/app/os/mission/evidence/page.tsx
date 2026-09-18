import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getEvidenceRepository } from "@/lib/repositories";

export const metadata = {
  title: "Evidence Center | Mission Control",
  description: "Filterable audit evidence trail",
};

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; activity?: string }>;
}) {
  await requirePolicy("/os/mission");
  await initDatabase();
  const sp = await searchParams;
  const repo = getEvidenceRepository();
  const types = await repo.listActivityTypes(100);
  const type = (sp.type ?? "").trim();
  const activity = (sp.activity ?? "").trim();
  const rows = await repo.query({
    activityType: type || undefined,
    activityId: activity || undefined,
    limit: 100,
  });
  const byDay = new Map<string, typeof rows>();
  for (const e of rows) {
    const day = new Date(e.timestamp).toISOString().slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <h1 className="mt-3 text-3xl font-bold text-text-primary tracking-tight">Evidence center</h1>
      <p className="text-sm text-text-tertiary mt-2">Append-only audit trail. Every row is a persisted fact — nothing here is generated for display.</p>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-ev-type">Event type</label>
          <select id="mc-ev-type" name="type" defaultValue={type} className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary">
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-ev-activity">Activity / record id</label>
          <input id="mc-ev-activity" name="activity" defaultValue={activity} placeholder="e.g. mc-job-…" className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-secondary" />
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg border border-border-primary text-sm text-text-primary">Filter</button>
        {(type || activity) && <Link href="/os/mission/evidence" className="px-4 py-2 text-sm text-accent-gold hover:underline">Clear</Link>}
      </form>

      <div className="mt-6 space-y-6">
        {rows.length === 0 && <p className="text-xs text-text-muted">No evidence matches the current filter.</p>}
        {[...byDay.entries()].map(([day, items]) => (
          <div key={day}>
            <h2 className="text-xs font-semibold text-text-tertiary mb-2">{day} ({items.length})</h2>
            <div className="space-y-2">
              {items.map((e) => (
                <div key={e.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5 break-words">
                  <span className="font-mono text-text-tertiary">{e.activityType}</span>
                  <span className="block mt-0.5">{e.description}</span>
                  <span className="block mt-0.5 text-text-muted">{new Date(e.timestamp).toLocaleString()} · {e.activityId}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
