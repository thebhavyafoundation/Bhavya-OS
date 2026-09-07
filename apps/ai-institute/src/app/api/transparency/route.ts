import { NextResponse } from "next/server";
import {
  getFinancials,
  getGovernanceDocs,
  getProjects,
  getPolicies,
} from "@/lib/os-data";

export async function GET() {
  const [financials, governance, projects, policies] = await Promise.all([
    getFinancials(),
    getGovernanceDocs(),
    getProjects(),
    getPolicies(),
  ]);

  return NextResponse.json({
    financials,
    governance,
    projects,
    policies,
  });
}
