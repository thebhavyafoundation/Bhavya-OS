import { NextRequest, NextResponse } from 'next/server';
import { getInstitutionalIntelligence, getKPIs, saveKPI } from '@/intelligence/kpis';
import type { InstitutionKPI, SystemName } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'summary': {
      const intelligence = getInstitutionalIntelligence();
      return NextResponse.json({ intelligence });
    }
    case 'kpis': {
      const category = searchParams.get('category') as InstitutionKPI['category'] | undefined;
      const kpis = getKPIs(category);
      return NextResponse.json({ kpis });
    }
    default: {
      const intelligence = getInstitutionalIntelligence();
      return NextResponse.json({ intelligence });
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'collect': {
      const intelligence = getInstitutionalIntelligence();

      saveKPI({ name: 'okr_progress', category: 'mission', value: intelligence.okrSummary.overallProgress, unit: '%', target: 100, trend: 'stable', source: 'ioc' as SystemName });
      saveKPI({ name: 'open_risks', category: 'risk', value: intelligence.riskSummary.open, unit: 'count', target: 0, trend: 'stable', source: 'ioc' as SystemName });
      saveKPI({ name: 'pending_actions', category: 'operations', value: intelligence.pendingActions, unit: 'count', target: 0, trend: 'stable', source: 'ioc' as SystemName });
      saveKPI({ name: 'system_health', category: 'technical', value: intelligence.systemHealth.overall === 'healthy' ? 100 : intelligence.systemHealth.overall === 'degraded' ? 50 : 0, unit: '%', target: 100, trend: 'stable', source: 'ioc' as SystemName });
      saveKPI({ name: 'event_volume', category: 'technical', value: intelligence.eventSummary.total, unit: 'count', source: 'ioc' as SystemName });

      return NextResponse.json({ collected: true });
    }
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  }
}
