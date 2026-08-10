/**
 * Product Analytics
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Self-hosted analytics layer tracking:
 * - Page views
 * - Scroll depth
 * - Navigation
 * - Feature usage
 * - Downloads
 * - Searches
 * - Donations
 * - Volunteer conversions
 * - Bounce rate
 * - Engagement
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'product-analytics', 'data');

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  appId: string;
  eventType: 'pageview' | 'scroll' | 'navigation' | 'feature' | 'download' | 'search' | 'donation' | 'volunteer' | 'bounce' | 'engagement';
  data: Record<string, any>;
  sessionId?: string;
  userId?: string;
}

interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
}

interface ScrollEvent {
  path: string;
  depth: number;
  timestamp: string;
}

interface FeatureEvent {
  feature: string;
  action: string;
  timestamp: string;
}

interface SearchEvent {
  query: string;
  results: number;
  timestamp: string;
}

interface DonationEvent {
  amount: number;
  currency: string;
  timestamp: string;
}

interface VolunteerEvent {
  action: string;
  timestamp: string;
}

export class ProductAnalytics {
  private events: AnalyticsEvent[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadEvents();
  }

  private loadEvents(): void {
    const eventsFile = join(this.dataDir, 'events.json');
    if (existsSync(eventsFile)) {
      this.events = JSON.parse(readFileSync(eventsFile, 'utf-8'));
    }
  }

  private saveEvents(): void {
    writeFileSync(
      join(this.dataDir, 'events.json'),
      JSON.stringify(this.events, null, 2)
    );
  }

  /**
   * Track an event
   */
  track(appId: string, eventType: AnalyticsEvent['eventType'], data: Record<string, any>, sessionId?: string, userId?: string): void {
    const event: AnalyticsEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      appId,
      eventType,
      data,
      sessionId,
      userId
    };

    this.events.push(event);
    this.saveEvents();
  }

  /**
   * Track page view
   */
  trackPageView(appId: string, path: string, title: string, referrer?: string, sessionId?: string): void {
    this.track(appId, 'pageview', { path, title, referrer }, sessionId);
  }

  /**
   * Track scroll depth
   */
  trackScroll(appId: string, path: string, depth: number, sessionId?: string): void {
    this.track(appId, 'scroll', { path, depth }, sessionId);
  }

  /**
   * Track navigation
   */
  trackNavigation(appId: string, from: string, to: string, sessionId?: string): void {
    this.track(appId, 'navigation', { from, to }, sessionId);
  }

  /**
   * Track feature usage
   */
  trackFeature(appId: string, feature: string, action: string, sessionId?: string): void {
    this.track(appId, 'feature', { feature, action }, sessionId);
  }

  /**
   * Track download
   */
  trackDownload(appId: string, file: string, sessionId?: string): void {
    this.track(appId, 'download', { file }, sessionId);
  }

  /**
   * Track search
   */
  trackSearch(appId: string, query: string, results: number, sessionId?: string): void {
    this.track(appId, 'search', { query, results }, sessionId);
  }

  /**
   * Track donation
   */
  trackDonation(appId: string, amount: number, currency: string = 'INR', sessionId?: string): void {
    this.track(appId, 'donation', { amount, currency }, sessionId);
  }

  /**
   * Track volunteer conversion
   */
  trackVolunteer(appId: string, action: string, sessionId?: string): void {
    this.track(appId, 'volunteer', { action }, sessionId);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: AnalyticsEvent['eventType'], limit?: number): AnalyticsEvent[] {
    const filtered = this.events.filter(e => e.eventType === eventType);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get events by app
   */
  getEventsByApp(appId: string, limit?: number): AnalyticsEvent[] {
    const filtered = this.events.filter(e => e.appId === appId);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get page views
   */
  getPageViews(appId?: string): PageView[] {
    let events = this.events.filter(e => e.eventType === 'pageview');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      path: e.data.path,
      title: e.data.title,
      referrer: e.data.referrer,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get scroll depths
   */
  getScrollDepths(appId?: string): ScrollEvent[] {
    let events = this.events.filter(e => e.eventType === 'scroll');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      path: e.data.path,
      depth: e.data.depth,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get feature usage
   */
  getFeatureUsage(appId?: string): FeatureEvent[] {
    let events = this.events.filter(e => e.eventType === 'feature');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      feature: e.data.feature,
      action: e.data.action,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get searches
   */
  getSearches(appId?: string): SearchEvent[] {
    let events = this.events.filter(e => e.eventType === 'search');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      query: e.data.query,
      results: e.data.results,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get donations
   */
  getDonations(appId?: string): DonationEvent[] {
    let events = this.events.filter(e => e.eventType === 'donation');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      amount: e.data.amount,
      currency: e.data.currency,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get volunteer conversions
   */
  getVolunteerConversions(appId?: string): VolunteerEvent[] {
    let events = this.events.filter(e => e.eventType === 'volunteer');
    if (appId) {
      events = events.filter(e => e.appId === appId);
    }
    return events.map(e => ({
      action: e.data.action,
      timestamp: e.timestamp
    }));
  }

  /**
   * Get analytics summary
   */
  getSummary(appId?: string): {
    totalEvents: number;
    pageViews: number;
    uniquePages: number;
    scrolls: number;
    navigations: number;
    features: number;
    downloads: number;
    searches: number;
    donations: number;
    volunteers: number;
    avgScrollDepth: number;
    topPages: { path: string; count: number }[];
    topFeatures: { feature: string; count: number }[];
    topSearches: { query: string; count: number }[];
  } {
    let events = appId ? this.events.filter(e => e.appId === appId) : this.events;

    const pageViews = events.filter(e => e.eventType === 'pageview').length;
    const uniquePages = new Set(events.filter(e => e.eventType === 'pageview').map(e => e.data.path)).size;
    const scrolls = events.filter(e => e.eventType === 'scroll').length;
    const navigations = events.filter(e => e.eventType === 'navigation').length;
    const features = events.filter(e => e.eventType === 'feature').length;
    const downloads = events.filter(e => e.eventType === 'download').length;
    const searches = events.filter(e => e.eventType === 'search').length;
    const donations = events.filter(e => e.eventType === 'donation').length;
    const volunteers = events.filter(e => e.eventType === 'volunteer').length;

    const scrollEvents = events.filter(e => e.eventType === 'scroll');
    const avgScrollDepth = scrollEvents.length > 0
      ? scrollEvents.reduce((sum, e) => sum + e.data.depth, 0) / scrollEvents.length
      : 0;

    // Top pages
    const pageCounts: Record<string, number> = {};
    events.filter(e => e.eventType === 'pageview').forEach(e => {
      pageCounts[e.data.path] = (pageCounts[e.data.path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top features
    const featureCounts: Record<string, number> = {};
    events.filter(e => e.eventType === 'feature').forEach(e => {
      featureCounts[e.data.feature] = (featureCounts[e.data.feature] || 0) + 1;
    });
    const topFeatures = Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top searches
    const searchCounts: Record<string, number> = {};
    events.filter(e => e.eventType === 'search').forEach(e => {
      searchCounts[e.data.query] = (searchCounts[e.data.query] || 0) + 1;
    });
    const topSearches = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: events.length,
      pageViews,
      uniquePages,
      scrolls,
      navigations,
      features,
      downloads,
      searches,
      donations,
      volunteers,
      avgScrollDepth,
      topPages,
      topFeatures,
      topSearches
    };
  }
}

// Singleton instance
let instance: ProductAnalytics | null = null;

export function getProductAnalytics(): ProductAnalytics {
  if (!instance) {
    instance = new ProductAnalytics();
  }
  return instance;
}
