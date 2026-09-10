export type FinancialType = "Quarterly" | "Annual";
export type FinancialStatus = "Audited" | "Provisional" | "In Preparation";

export type FinancialVerificationState =
  | "verified"
  | "reported"
  | "estimated"
  | "pending verification"
  | "demo";

export interface FinancialReport {
  id: string;
  title: string;
  period: string;
  status: FinancialStatus;
  approved: string;
  type: FinancialType;
  totalRevenue: number;
  totalExpenditure: number;
  notes: string;
  verification: FinancialVerificationState;
}

export const financials: readonly FinancialReport[] = [
  {
    id: "FIN-2026-Q1",
    title: "Q1 2026 Financial Statement",
    period: "Jan–Mar 2026",
    status: "Audited",
    approved: "2026-04-15",
    type: "Quarterly",
    totalRevenue: 0,
    totalExpenditure: 0,
    notes:
      "Foundation bootstrap phase. Initial operational costs covered by trustee contributions. No external donations received.",
    verification: "verified",
  },
  {
    id: "FIN-2026-Q2",
    title: "Q2 2026 Financial Statement",
    period: "Apr–Jun 2026",
    status: "Audited",
    approved: "2026-07-15",
    type: "Quarterly",
    totalRevenue: 0,
    totalExpenditure: 0,
    notes:
      "Platform integration phase. AI Gateway infrastructure, monorepo tooling, and registry generator development. Operational costs remain covered by trustee contributions.",
    verification: "verified",
  },
  {
    id: "FIN-2026-Q3",
    title: "Q3 2026 Financial Statement",
    period: "Jul–Sep 2026",
    status: "Provisional",
    approved: "2026-07-23",
    type: "Quarterly",
    totalRevenue: 0,
    totalExpenditure: 0,
    notes:
      "Runtime freeze and website production build. Mission Runtime expansion, SDK creation, and transparency portal development. Full financial disclosure pending end-of-quarter accounting.",
    verification: "reported",
  },
  {
    id: "FIN-ANNUAL-2026",
    title: "Annual Report 2026",
    period: "FY 2025–2026",
    status: "In Preparation",
    approved: "—",
    type: "Annual",
    totalRevenue: 0,
    totalExpenditure: 0,
    notes:
      "Annual report in preparation. Will include full financial statements, program impact assessment, governance report, and strategic outlook for 2027.",
    verification: "pending verification",
  },
] as const;
