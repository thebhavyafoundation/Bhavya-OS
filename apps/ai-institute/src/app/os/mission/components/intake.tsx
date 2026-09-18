"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data;
}

/**
 * Lesson intake: references a canonical academy or studio lesson as a
 * Mission Control artifact (reference only — the lesson store is untouched).
 * Editing happens in Studio; MC tracks review versions.
 */
export function LessonIntakeForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [source, setSource] = useState<"academy" | "studio">("academy");
  const [lessonId, setLessonId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!lessonId.trim()) {
      setError("Lesson ID is required (e.g. found-1-1).");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await postJson("/os/mission/api/artifacts", {
        op: source === "academy" ? "fromAcademyLesson" : "fromStudioLesson",
        jobId,
        lessonId: lessonId.trim(),
      });
      setLessonId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Intake failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
      <div className="flex gap-2 text-xs text-text-secondary" role="radiogroup" aria-label="Lesson source">
        {(["academy", "studio"] as const).map((s) => (
          <label key={s} className="flex items-center gap-1.5 border border-border-primary rounded-full px-2.5 py-1">
            <input type="radio" name="lesson-source" checked={source === s} onChange={() => setSource(s)} />
            {s === "academy" ? "Academy" : "Studio"}
          </label>
        ))}
      </div>
      <input
        value={lessonId}
        onChange={(e) => setLessonId(e.target.value)}
        placeholder="Lesson ID (e.g. found-1-1)"
        aria-label="Lesson ID"
        className="flex-1 min-w-40 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-xs text-text-primary placeholder-text-secondary"
      />
      <button type="submit" disabled={busy} className="px-3 py-1.5 rounded-lg border border-border-primary text-xs font-medium text-text-primary disabled:opacity-50">
        {busy ? "Intaking…" : "Intake lesson"}
      </button>
      {error && <p role="alert" className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
