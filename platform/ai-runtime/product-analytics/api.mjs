/**
 * Analytics API
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * API endpoint for product analytics
 */

import { getProductAnalytics } from './analytics.mjs';

const analytics = getProductAnalytics();

/**
 * Handle analytics API requests
 */
export async function handleAnalyticsRequest(req, res) {
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
    if (path === '/api/analytics/summary') {
      const appId = url.searchParams.get('appId');
      const summary = analytics.getSummary(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(summary));
    } else if (path === '/api/analytics/pageviews') {
      const appId = url.searchParams.get('appId');
      const pageviews = analytics.getPageViews(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pageviews));
    } else if (path === '/api/analytics/scrolls') {
      const appId = url.searchParams.get('appId');
      const scrolls = analytics.getScrollDepths(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(scrolls));
    } else if (path === '/api/analytics/features') {
      const appId = url.searchParams.get('appId');
      const features = analytics.getFeatureUsage(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(features));
    } else if (path === '/api/analytics/searches') {
      const appId = url.searchParams.get('appId');
      const searches = analytics.getSearches(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(searches));
    } else if (path === '/api/analytics/donations') {
      const appId = url.searchParams.get('appId');
      const donations = analytics.getDonations(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(donations));
    } else if (path === '/api/analytics/volunteers') {
      const appId = url.searchParams.get('appId');
      const volunteers = analytics.getVolunteerConversions(appId || undefined);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(volunteers));
    } else if (path === '/api/analytics/track' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const { appId, eventType, data, sessionId, userId } = JSON.parse(body);
        analytics.track(appId, eventType, data, sessionId, userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
