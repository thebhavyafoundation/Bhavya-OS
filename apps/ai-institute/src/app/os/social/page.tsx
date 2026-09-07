import { requirePolicy } from "@/lib/require-role";
import { getSocialData } from "@/lib/os-data";
import {
  MessageSquare,
  Calendar,
  Megaphone,
  Users,
  TrendingUp,
  BarChart3,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Social Operations | Bhavya Foundation",
  description:
    "Communication operations, publications, and social intelligence",
};

export default async function SocialPage() {
  await requirePolicy("/os/social");
  const data = getSocialData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Social Operations
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Communication operations, publications, and social intelligence
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span className="text-xs text-text-tertiary">Publications</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.totalPublications}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {data.publishedCount} published · {data.draftCount} drafts
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Campaigns</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.totalCampaigns}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {data.activeCampaigns} active
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Calendar</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.calendar.length}
          </div>
          <div className="text-[11px] text-text-muted mt-1">scheduled items</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-text-tertiary">Feedback</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {data.feedback.length}
          </div>
          <div className="text-[11px] text-text-muted mt-1">community signals</div>
        </div>
      </div>

      {/* Empty state */}
      {data.totalPublications === 0 && data.totalCampaigns === 0 && (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center mb-8">
          <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary mb-2">
            Social OS database not seeded yet
          </p>
          <p className="text-xs text-text-muted">
            Start the social-os app and run the seed endpoint to populate
            publications, campaigns, and community data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publications */}
        <div className="lg:col-span-2 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Recent Publications
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-primary">
            {data.publications.slice(0, 10).map((pub) => (
              <div key={pub.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary truncate">
                    {pub.title}
                  </span>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-[10px] text-text-muted">
                      {pub.source_type}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        pub.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : pub.status === "approved"
                            ? "bg-accent-gold/10 text-accent-gold"
                            : "bg-text-muted/10 text-text-muted"
                      }`}
                    >
                      {pub.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted truncate">{pub.content}</p>
                {pub.scheduled_at && (
                  <p className="text-[10px] text-accent-gold mt-1">
                    _scheduled: {new Date(pub.scheduled_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {data.publications.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">No publications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Campaigns + Feedback */}
        <div className="space-y-6">
          {/* Campaigns */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-accent-gold" />
                <span className="text-sm font-semibold text-text-primary">
                  Campaigns
                </span>
              </div>
            </div>
            <div className="divide-y divide-border-primary">
              {data.campaigns.slice(0, 5).map((camp) => (
                <div key={camp.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary truncate">
                      {camp.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        camp.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : camp.status === "planning"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-text-muted/10 text-text-muted"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {camp.type} · {camp.description || "no description"}
                  </p>
                </div>
              ))}
              {data.campaigns.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No campaigns</p>
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border-primary">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-gold" />
                <span className="text-sm font-semibold text-text-primary">
                  Community Feedback
                </span>
              </div>
            </div>
            <div className="divide-y divide-border-primary">
              {data.feedback.slice(0, 5).map((fb) => (
                <div key={fb.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-primary truncate">
                      {fb.source}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {fb.classification}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 truncate">
                    {fb.content}
                  </p>
                </div>
              ))}
              {data.feedback.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-text-muted">No feedback yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {data.metrics.length > 0 && (
        <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Institution Metrics
              </span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.metrics.slice(0, 8).map((m) => (
              <div key={m.id}>
                <span className="text-[11px] text-text-muted">{m.name}</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-text-primary">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-text-muted">{m.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp
                    className={`w-3 h-3 ${
                      m.trend === "up"
                        ? "text-green-400"
                        : m.trend === "down"
                          ? "text-red-400"
                          : "text-text-muted"
                    }`}
                  />
                  <span className="text-[10px] text-text-muted">
                    {m.change_percent > 0 ? "+" : ""}
                    {m.change_percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      {data.calendar.length > 0 && (
        <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold text-text-primary">
                Editorial Calendar
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-primary">
            {data.calendar.slice(0, 10).map((entry) => (
              <div key={entry.id} className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-primary">{entry.title}</span>
                  <p className="text-[11px] text-text-muted">
                    {entry.type} · {entry.scheduled_date}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                    entry.status === "published"
                      ? "bg-green-500/10 text-green-400"
                      : entry.status === "scheduled"
                        ? "bg-accent-gold/10 text-accent-gold"
                        : "bg-text-muted/10 text-text-muted"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
