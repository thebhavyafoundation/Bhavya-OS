import {
  getDecisionContexts,
  getLessons,
  getPatterns,
  getMemoryStats,
  getSuccessfulPatterns,
  getDecisionsWithFullContext,
  generateLearningReport,
  getLearningVelocity,
} from "@bhavya/content-core";

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "20px 24px" }}>
      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: "0 0 16px 0" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function MemoryPage() {
  const stats = getMemoryStats();
  const decisions = getDecisionContexts();
  const lessons = getLessons();
  const patterns = getPatterns();
  const successfulPatterns = getSuccessfulPatterns();
  const decisionsWithFullContext = getDecisionsWithFullContext();
  const learningReport = generateLearningReport();
  const learningVelocity = getLearningVelocity();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#8b5cf6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase III: Institutional Learning
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Institutional Memory
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Capture why decisions were made, not just what happened. Preserving institutional context for future learning.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Decisions Documented" value={stats.totalDecisions} color="#8b5cf6" />
        <StatCard label="Lessons Learned" value={stats.totalLessons} color="#10b981" />
        <StatCard label="Patterns Identified" value={stats.totalPatterns} color="#3b82f6" />
        <StatCard label="Full Context Decisions" value={stats.decisionsWithContext} color="#f59e0b" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Decision Contexts */}
        <WidgetCard title="Decision Contexts">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {decisions.slice(0, 3).map((decision) => (
              <div key={decision.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{decision.title}</p>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "#8b5cf620",
                    color: "#8b5cf6",
                  }}>
                    {decision.decisionType}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>
                  {decision.rationale.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {decision.alternativesConsidered.length} alternatives
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {decision.risksIdentified.length} risks
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {decision.participants.length} participants
                  </p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Lessons Learned */}
        <WidgetCard title="Lessons Learned">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{lesson.title}</p>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: lesson.category === "success" ? "#10b98120" : lesson.category === "failure" ? "#ef444420" : "#3b82f620",
                    color: lesson.category === "success" ? "#10b981" : lesson.category === "failure" ? "#ef4444" : "#3b82f6",
                  }}>
                    {lesson.category}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>
                  {lesson.description.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 6px", background: "#334155", borderRadius: 4, color: "#94a3b8" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Patterns and Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Institutional Patterns */}
        <WidgetCard title="Institutional Patterns">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {patterns.slice(0, 3).map((pattern) => (
              <div key={pattern.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{pattern.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 50, height: 6, background: "#334155", borderRadius: 3 }}>
                      <div style={{ width: `${pattern.successRate * 100}%`, height: "100%", background: "#10b981", borderRadius: 3 }} />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{Math.round(pattern.successRate * 100)}%</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>
                  {pattern.description.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {pattern.frequency} occurrences
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {pattern.sampleSize} sample size
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                    {Math.round(pattern.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Learning Stats */}
        <WidgetCard title="Learning Metrics">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Decisions with Full Context</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{decisionsWithFullContext.length}/{decisions.length}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Successful Patterns</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#10b981", margin: 0 }}>{successfulPatterns.length}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Lessons by Category</p>
              <div style={{ display: "flex", gap: 12 }}>
                {Object.entries(stats.lessonsByCategory).map(([category, count]) => (
                  <div key={category} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{count}</p>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0 0", textTransform: "capitalize" }}>{category}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Patterns by Type</p>
              <div style={{ display: "flex", gap: 12 }}>
                {Object.entries(stats.patternsByType).map(([type, count]) => (
                  <div key={type} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{count}</p>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0 0", textTransform: "capitalize" }}>{type}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid #334155", paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px 0" }}>Learning Velocity</p>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{learningVelocity.lessonsPerMonth}</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0 0" }}>Lessons/Month</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{learningVelocity.patternsPerMonth}</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0 0" }}>Patterns/Month</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{Math.round(learningVelocity.avgConfidence * 100)}%</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0 0" }}>Avg Confidence</p>
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Learning Insights */}
      <div style={{ marginTop: 24 }}>
        <WidgetCard title="Learning Insights">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {learningReport.insights.slice(0, 4).map((insight) => (
              <div key={insight.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{insight.title}</p>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: insight.type === "pattern" ? "#8b5cf620" : insight.type === "recommendation" ? "#10b98120" : "#3b82f620",
                    color: insight.type === "pattern" ? "#8b5cf6" : insight.type === "recommendation" ? "#10b981" : "#3b82f6",
                  }}>
                    {insight.type}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>{insight.description}</p>
                {insight.recommendation && (
                  <p style={{ fontSize: 11, color: "#10b981", margin: "4px 0 0 0" }}>→ {insight.recommendation}</p>
                )}
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
