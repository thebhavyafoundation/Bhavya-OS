// ============================================================
// Bhavya Foundation — Metrics API Route
// GET /api/metrics — Prometheus-compatible metrics
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
  const usage = process.memoryUsage();

  const metrics = [
    '# HELP bhavya_website_memory_heap_used_bytes Website heap memory used in bytes',
    '# TYPE bhavya_website_memory_heap_used_bytes gauge',
    `bhavya_website_memory_heap_used_bytes ${usage.heapUsed}`,
    '',
    '# HELP bhavya_website_memory_heap_total_bytes Website heap memory total in bytes',
    '# TYPE bhavya_website_memory_heap_total_bytes gauge',
    `bhavya_website_memory_heap_total_bytes ${usage.heapTotal}`,
    '',
    '# HELP bhavya_website_memory_rss_bytes Website RSS memory in bytes',
    '# TYPE bhavya_website_memory_rss_bytes gauge',
    `bhavya_website_memory_rss_bytes ${usage.rss}`,
    '',
    '# HELP bhavya_website_uptime_seconds Website uptime in seconds',
    '# TYPE bhavya_website_uptime_seconds gauge',
    `bhavya_website_uptime_seconds ${process.uptime()}`,
    '',
    '# HELP bhavya_website_info Website information',
    '# TYPE bhavya_website_info gauge',
    `bhavya_website_info{version="${process.env.APP_VERSION || '0.9.0'}",environment="${process.env.NODE_ENV || 'development'}"} 1`,
  ].join('\n');

  return new NextResponse(metrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
