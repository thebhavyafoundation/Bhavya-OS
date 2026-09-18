/**
 * Metadata-level version comparison (Mission Control).
 *
 * Artifact bodies are NOT persisted (no second storage system), so diffs
 * operate on version metadata only: producer, human-replacement flag,
 * note, path/hash presence, status. The UI must label this as a metadata
 * comparison — never imply body content was diffed.
 */

export interface VersionFacts {
  version: number;
  producer: string;
  humanReplacement: boolean;
  note: string;
  path: string;
  hash: string;
  status: string;
}

export interface VersionChange {
  field: string;
  before: string;
  after: string;
}

const FIELDS: { key: keyof VersionFacts; label: string }[] = [
  { key: "producer", label: "producer" },
  { key: "humanReplacement", label: "human replacement" },
  { key: "note", label: "note" },
  { key: "path", label: "path" },
  { key: "hash", label: "hash" },
  { key: "status", label: "status" },
];
// NOTE: `version` is identity, not a change — never diffed.

function render(value: unknown): string {
  if (typeof value === "boolean") return value ? "yes" : "no";
  const s = String(value ?? "");
  return s === "" ? "—" : s;
}

/** Deterministic metadata diff between two consecutive versions. */
export function diffVersions(prev: VersionFacts, curr: VersionFacts): VersionChange[] {
  const changes: VersionChange[] = [];
  for (const { key, label } of FIELDS) {
    if (prev[key] !== curr[key]) {
      changes.push({ field: label, before: render(prev[key]), after: render(curr[key]) });
    }
  }
  return changes;
}
