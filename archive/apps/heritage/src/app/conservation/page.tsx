import { getConservationPlans } from "@/lib/data";
import type { ConservationPlan } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  planned: "#94a3b8", "in-progress": "#f59e0b", completed: "#10b981", monitoring: "#22d3ee",
};

export default function ConservationPage() {
  const plans = getConservationPlans();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Conservation Plans</h1>
        {plans.length === 0 ? (
          <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No conservation plans yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {plans.map((plan: ConservationPlan) => (
              <div key={plan.id} style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{plan.title}</div>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 10,
                    background: `${STATUS_COLORS[plan.status]}22`, color: STATUS_COLORS[plan.status],
                  }}>{plan.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Scope: {plan.scope.length} items &middot; {plan.estimatedCost ? `Cost: $${plan.estimatedCost.toLocaleString()}` : "Cost TBD"}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
