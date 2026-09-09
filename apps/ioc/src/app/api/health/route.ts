import { NextRequest, NextResponse } from 'next/server';
import { checkAllSystems, checkSystemHealth, getSystemHealthFromDb, getOperationalHealth } from '@/lib/system-health';
import type { SystemName } from '@/lib/types';
import { withAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'check': {
      const systems = await checkAllSystems();
      return NextResponse.json({ systems });
    }
    case 'check-one': {
      const system = searchParams.get('system') as SystemName;
      if (!system) return NextResponse.json({ error: 'system required' }, { status: 400 });
      const health = await checkSystemHealth(system);
      return NextResponse.json({ health });
    }
    case 'operational': {
      const health = getOperationalHealth();
      return NextResponse.json({ health });
    }
    default: {
      const systems = getSystemHealthFromDb();
      return NextResponse.json({ systems });
    }
  }
}

export const POST = withAuth(async (request, _user) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action } = body;

  switch (action) {
    case 'check-all': {
      const systems = await checkAllSystems();
      return NextResponse.json({ systems });
    }
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  }
});
