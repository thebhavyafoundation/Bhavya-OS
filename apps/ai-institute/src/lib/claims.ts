export type ClaimState = "verified" | "target" | "pending" | "removed";

export interface Claim {
  id: string;
  claim: string;
  value: string;
  state: ClaimState;
  source: string;
  checked: string;
}

export const CLAIMS: readonly Claim[] = [
  {
    id: "curriculum-levels",
    claim: "Curriculum levels",
    value: "13 levels",
    state: "verified",
    source:
      "src/data/curriculum-levels.ts (computed via getTotalModules chain)",
    checked: "2026-09-26",
  },
  {
    id: "curriculum-modules",
    claim: "Curriculum modules",
    value: "74 modules",
    state: "verified",
    source: "docs/master-curriculum/MODULE_CATALOG.md + getTotalModules()",
    checked: "2026-09-26",
  },
  {
    id: "missions",
    claim: "Missions",
    value: "4 missions",
    state: "verified",
    source: "_archive/constitution-2026-09-05/15_Brand_Constitution.md Ch.6",
    checked: "2026-09-26",
  },
  // Future verified claims append here with sources; removed claims stay
  // recorded with state "removed" so historical edits are auditable.
] as const;

const BY_ID = new Map(CLAIMS.map((c) => [c.id, c]));

export function claimValue(id: string): string {
  const c = BY_ID.get(id);
  if (!c) throw new Error(`Unknown claim id: ${id}`);
  return c.value;
}

export function isApprovedNumber(raw: string): boolean {
  for (const c of CLAIMS) if (c.value === raw) return true;
  return /^\d+ (levels|modules|lessons)$/.test(raw.trim());
}
