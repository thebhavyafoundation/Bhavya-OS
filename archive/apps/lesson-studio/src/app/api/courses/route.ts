import { NextResponse } from 'next/server';

const RUNTIME_URL = process.env.RUNTIME_URL || 'http://localhost:3100';

async function proxy(method: string, path: string, body?: unknown) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${RUNTIME_URL}${path}`, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET() {
  try { return await proxy('GET', '/courses'); }
  catch { return NextResponse.json([]); }
}

export async function POST(request: Request) {
  const body = await request.json();
  try { return await proxy('POST', '/courses', body); }
  catch { return NextResponse.json({ error: 'Runtime unavailable' }, { status: 503 }); }
}
