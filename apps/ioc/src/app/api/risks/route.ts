import { NextRequest, NextResponse } from 'next/server';
import { createRisk, listRisks, updateRiskStatus, getRiskSummary } from '@/lib/risks';
import type { RiskSeverity, RiskStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'summary': {
      return NextResponse.json({ summary: getRiskSummary() });
    }
    default: {
      const severity = searchParams.get('severity') as RiskSeverity | undefined;
      const status = searchParams.get('status') as RiskStatus | undefined;
      const risks = listRisks({ severity, status });
      return NextResponse.json({ risks });
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'create': {
      const { title, description, severity, department, owner, mitigationPlan } = body;
      if (!title || !severity) return NextResponse.json({ error: 'title and severity required' }, { status: 400 });
      const risk = createRisk({ title, description, severity, department, owner, mitigationPlan });
      return NextResponse.json({ risk }, { status: 201 });
    }
    case 'update-status': {
      const { riskId, status, mitigationProgress } = body;
      if (!riskId || !status) return NextResponse.json({ error: 'riskId and status required' }, { status: 400 });
      const risk = updateRiskStatus(riskId, status, mitigationProgress);
      return NextResponse.json({ risk });
    }
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  }
}
