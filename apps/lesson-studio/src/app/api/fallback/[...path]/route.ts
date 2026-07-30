/**
 * Fallback API handler — proxies to runtime when available,
 * returns clear guidance when it isn't.
 *
 * This is the ONLY route file in the Lesson Studio API layer.
 * All business logic lives in the runtime engine.
 */

import { NextResponse } from 'next/server';

const RUNTIME_URL = process.env.RUNTIME_URL || 'http://localhost:3100';
const IS_RUNTIME_REQUIRED = process.env.REQUIRE_RUNTIME === 'true';

async function proxyToRuntime(method: string, path: string, body?: unknown) {
  const url = `${RUNTIME_URL}/${path}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000),
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    return await proxyToRuntime('GET', path);
  } catch {
    if (IS_RUNTIME_REQUIRED) {
      return NextResponse.json(
        { error: 'Runtime required. Start with: pnpm run bhavya:api', hint: 'pnpm run bhavya:api' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Runtime not running. Start the runtime for full functionality.', hint: 'pnpm run bhavya:api' },
      { status: 503 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json().catch(() => ({}));
  try {
    return await proxyToRuntime('POST', path, body);
  } catch {
    return NextResponse.json(
      { error: 'Runtime not running. Start with: pnpm run bhavya:api', hint: 'pnpm run bhavya:api' },
      { status: 503 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json().catch(() => ({}));
  try {
    return await proxyToRuntime('PUT', path, body);
  } catch {
    return NextResponse.json(
      { error: 'Runtime not running. Start with: pnpm run bhavya:api', hint: 'pnpm run bhavya:api' },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    return await proxyToRuntime('DELETE', path);
  } catch {
    return NextResponse.json(
      { error: 'Runtime not running. Start with: pnpm run bhavya:api', hint: 'pnpm run bhavya:api' },
      { status: 503 }
    );
  }
}
