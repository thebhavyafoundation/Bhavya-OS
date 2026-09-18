import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";

export const metadata = {
  title: "Decision History | Mission Control",
  description: "Immutable human decision audit trail",
};

const ACTIONS = ["approve", "reject", "request_revision", "approve_with_modification", "abort", "approve_integration"];

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; actor?: string; q?: string }>;
}) {
  await requirePolicy("/os/mission");
  await initDatabase();
  const sp = await searchParams;
  const repo = getMissionControlRepository();
  const action = (sp.action ?? "").trim();
  const actor = (sp.actor ?? "").trim();
  const q = (sp.q ?? "").trim();
  const all = q ? await repo.searchDecisions(q) : await repo.listDecisions();
  const rows = all.filter(
    (d) =>
      (!action || d.action === action) &&
      (!actor || d.actor.toLowerCase().includes(actor.toLowerCase())),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <h1 className="mt-3 text-3xl font-bold text-text-primary tracking-tight">Decision history</h1>
      <p className="text-sm text-text-tertiary mt-2">Append-only. Decisions are never edited or deleted — corrections are new decisions.</p>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-dec-action">Action</label>
          <select id="mc-dec-action" name="action" defaultValue={action} className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary">
            <option value="">All</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-dec-actor">Actor</label>
          <input id="mc-dec-actor" name="actor" defaultValue={actor} placeholder="email or id…" className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-secondary" />
        </div>
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-dec-q">Search reason/instruction</label>
          <input id="mc-dec-q" name="q" defaultValue={q} placeholder="e.g. voice…" className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-secondary" />
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg border border-border-primary text-sm text-text-primary">Filter</button>
        {(action || actor || q) && <Link href="/os/mission/decisions" className="px-4 py-2 text-sm text-accent-gold hover:underline">Clear</Link>}
      </form>

      <div className="mt-6 space-y-2">
        {rows.length === 0 && <p className="text-xs text-text-muted">No decisions match.</p>}
        {rows.map((d) => (
          <div key={d.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5 break-words">
            <span className="font-semibold text-text-primary">{d.action}</span> by {d.actor} · {new Date(d.createdAt).toLocaleString()}
            <span className="block text-text-muted mt-0.5">Target: {d.targetKind} {d.targetId}{typeof d.artifactVersion === "number" ? ` v${d.artifactVersion}` : ""}</span>
            {d.reason && <span className="block mt-0.5">Reason: {d.reason}</span>}
            {d.instruction && <span className="block mt-0.5">Instruction: {d.instruction}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
