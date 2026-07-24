// ============================================================
// Bhavya Foundation — Readiness API Route
// GET /api/ready — Readiness check endpoint
// ============================================================

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const checks: Record<string, { status: string; latency?: number }> = {};

  // Check filesystem
  const startFs = Date.now();
  try {
    const configPath = path.join(process.cwd(), 'config');
    const registryPath = path.join(process.cwd(), 'registry');
    const contentPath = path.join(process.cwd(), 'content');

    await fs.access(configPath);
    await fs.access(registryPath);
    await fs.access(contentPath);

    checks.filesystem = { status: 'ok', latency: Date.now() - startFs };
  } catch {
    checks.filesystem = { status: 'error', latency: Date.now() - startFs };
  }

  // Check memory
  const usage = process.memoryUsage();
  const maxHeap = 512 * 1024 * 1024; // 512MB limit
  const heapRatio = usage.heapUsed / maxHeap;

  checks.memory = {
    status: heapRatio < 0.9 ? 'ok' : 'warning',
  };

  // Overall status
  const ready = Object.values(checks).every(c => c.status === 'ok');

  return NextResponse.json(
    {
      status: ready ? 'ready' : 'not_ready',
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
