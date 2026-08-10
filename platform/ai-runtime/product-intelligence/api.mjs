/**
 * Metrics API
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * API endpoint for product metrics
 */

import { getProductIntelligenceEngine } from './engine.mjs';

const engine = getProductIntelligenceEngine();

/**
 * Handle metrics API requests
 */
export async function handleMetricsRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (path === '/api/metrics/summary') {
      const summary = engine.getSummary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(summary));
    } else if (path === '/api/metrics/latest') {
      const latest = engine.getLatestMetrics();
      const obj = {};
      for (const [appId, metrics] of latest.entries()) {
        obj[appId] = metrics;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj));
    } else if (path.startsWith('/api/metrics/app/')) {
      const appId = path.split('/').pop();
      const metrics = engine.getAppMetrics(appId, 10);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(metrics));
    } else if (path.startsWith('/api/metrics/history/')) {
      const parts = path.split('/');
      const appId = parts[4];
      const metric = parts[5];
      const history = engine.getMetricHistory(appId, metric, 100);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(history));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
