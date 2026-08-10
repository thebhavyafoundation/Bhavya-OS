import {
  generatePredictions,
  assessRisks,
  generateForecasts,
  getPredictionSummary,
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

function PredictionCard({ prediction }: { prediction: any }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    risk: { bg: "#ef444420", text: "#ef4444" },
    opportunity: { bg: "#10b98120", text: "#10b981" },
    forecast: { bg: "#3b82f620", text: "#3b82f6" },
    anomaly: { bg: "#f59e0b20", text: "#f59e0b" },
  };

  const colors = typeColors[prediction.type] || typeColors.forecast;

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{prediction.title}</p>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {prediction.type}
        </span>
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}>{prediction.description}</p>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Confidence: {Math.round(prediction.confidence * 100)}%
        </span>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Timeframe: {prediction.timeframe}
        </span>
        {prediction.severity && (
          <span style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
            background: prediction.severity === "high" ? "#ef444420" : prediction.severity === "medium" ? "#f59e0b20" : "#3b82f620",
            color: prediction.severity === "high" ? "#ef4444" : prediction.severity === "medium" ? "#f59e0b" : "#3b82f6",
          }}>
            {prediction.severity}
          </span>
        )}
      </div>
      <p style={{ fontSize: 11, color: "#10b981", margin: "8px 0 0 0" }}>→ {prediction.recommendation}</p>
    </div>
  );
}

export default function PredictivePage() {
  const predictions = generatePredictions();
  const risks = assessRisks();
  const forecasts = generateForecasts();
  const summary = getPredictionSummary();

  const risksList = predictions.filter((p) => p.type === "risk");
  const opportunities = predictions.filter((p) => p.type === "opportunity");
  const forecastsList = predictions.filter((p) => p.type === "forecast");
  const anomalies = predictions.filter((p) => p.type === "anomaly");

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase III: Predictive Intelligence
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Forward-Looking Analysis
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Estimates likely outcomes based on historical patterns. Predictions are backed by evidence and confidence scores.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Predictions" value={summary.totalPredictions} color="#f8fafc" />
        <StatCard label="Risks Identified" value={summary.risks} color="#ef4444" />
        <StatCard label="Opportunities" value={summary.opportunities} color="#10b981" />
        <StatCard label="Forecasts" value={summary.forecasts} color="#3b82f6" />
        <StatCard label="Avg Confidence" value={`${Math.round(summary.avgConfidence * 100)}%`} color="#8b5cf6" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Risks */}
        <WidgetCard title="Risks">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {risksList.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>✓ No significant risks identified</p>
            ) : (
              risksList.slice(0, 3).map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))
            )}
          </div>
        </WidgetCard>

        {/* Opportunities */}
        <WidgetCard title="Opportunities">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {opportunities.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No opportunities identified</p>
            ) : (
              opportunities.slice(0, 3).map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))
            )}
          </div>
        </WidgetCard>
      </div>

      {/* Forecasts and Anomalies */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Forecasts */}
        <WidgetCard title="Forecasts">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {forecastsList.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No forecasts available</p>
            ) : (
              forecastsList.map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))
            )}
          </div>
        </WidgetCard>

        {/* Anomalies */}
        <WidgetCard title="Anomalies">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {anomalies.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>✓ No anomalies detected</p>
            ) : (
              anomalies.slice(0, 3).map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))
            )}
          </div>
        </WidgetCard>
      </div>

      {/* Risk Assessment Table */}
      {risks.length > 0 && (
        <WidgetCard title="Risk Assessment">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {risks.map((risk) => (
              <div key={risk.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{risk.risk}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>Risk Score:</span>
                    <div style={{ width: 60, height: 6, background: "#334155", borderRadius: 3 }}>
                      <div style={{
                        width: `${risk.riskScore * 100}%`,
                        height: "100%",
                        background: risk.riskScore >= 0.7 ? "#ef4444" : risk.riskScore >= 0.4 ? "#f59e0b" : "#10b981",
                        borderRadius: 3,
                      }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#f8fafc" }}>{Math.round(risk.riskScore * 100)}%</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}>
                  Probability: {Math.round(risk.probability * 100)}% • Impact: {Math.round(risk.impact * 100)}%
                </p>
                <p style={{ fontSize: 11, color: "#10b981", margin: 0 }}>Mitigation: {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Forecasts Detail */}
      {forecasts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <WidgetCard title="Forecast Details">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {forecasts.map((forecast) => (
                <div key={forecast.id} style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>{forecast.metric}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", margin: 0 }}>{forecast.currentValue}</p>
                    <p style={{ fontSize: 14, color: "#10b981", margin: 0 }}>→ {forecast.predictedValue}</p>
                  </div>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0 0" }}>
                    {forecast.timeframe} • {Math.round(forecast.confidence * 100)}% confidence
                  </p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "4px 0 0 0" }}>{forecast.basis}</p>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      )}
    </div>
  );
}
