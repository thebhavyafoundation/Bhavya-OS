import {
  getScheduledTasks,
  getStewardshipStats,
  getOverdueTasks,
  getUpcomingTasks,
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

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    scheduled: { bg: "#3b82f620", text: "#3b82f6" },
    pending: { bg: "#f59e0b20", text: "#f59e0b" },
    "in-progress": { bg: "#8b5cf620", text: "#8b5cf6" },
    completed: { bg: "#10b98120", text: "#10b981" },
    overdue: { bg: "#ef444420", text: "#ef4444" },
    cancelled: { bg: "#64748b20", text: "#64748b" },
  };

  const colors = statusColors[status] || statusColors.scheduled;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {status}
    </span>
  );
}

function TaskCard({ task }: { task: any }) {
  const typeLabels: Record<string, string> = {
    "policy-review": "Policy Review",
    "annual-report": "Annual Report",
    "board-agenda": "Board Agenda",
    "compliance-reminder": "Compliance",
    "knowledge-review": "Knowledge Review",
    "broken-reference-detection": "Reference Check",
    "archive-recommendation": "Archive",
    "succession-review": "Succession Review",
    "pattern-validation": "Pattern Validation",
    "playbook-update": "Playbook Update",
  };

  const typeColors: Record<string, { bg: string; text: string }> = {
    "policy-review": { bg: "#3b82f620", text: "#3b82f6" },
    "annual-report": { bg: "#10b98120", text: "#10b981" },
    "board-agenda": { bg: "#8b5cf620", text: "#8b5cf6" },
    "compliance-reminder": { bg: "#ef444420", text: "#ef4444" },
    "knowledge-review": { bg: "#06b6d420", text: "#06b6d4" },
    "broken-reference-detection": { bg: "#f59e0b20", text: "#f59e0b" },
    "archive-recommendation": { bg: "#64748b20", text: "#64748b" },
    "succession-review": { bg: "#ec489920", text: "#ec4899" },
    "pattern-validation": { bg: "#14b8a620", text: "#14b8a6" },
    "playbook-update": { bg: "#f9731620", text: "#f97316" },
  };

  const colors = typeColors[task.type] || typeColors["policy-review"];
  const isOverdue = task.status === "overdue" || (task.dueDate && new Date(task.dueDate) < new Date());

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: `1px solid ${isOverdue ? "#ef444440" : "#334155"}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {typeLabels[task.type] || task.type}
        </span>
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}>{task.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Recurrence</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{task.recurrence}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Next Run</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: isOverdue ? "#ef4444" : "#f8fafc", margin: 0 }}>
            {new Date(task.nextRun).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Due Date</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: task.dueDate && new Date(task.dueDate) < new Date() ? "#ef4444" : "#f8fafc", margin: 0 }}>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
          </p>
        </div>
      </div>

      {task.assignedTo && (
        <p style={{ fontSize: 11, color: "#64748b", margin: "8px 0 0 0" }}>
          Assigned to: {task.assignedTo}
        </p>
      )}
    </div>
  );
}

export default function StewardshipPage() {
  const tasks = getScheduledTasks();
  const stats = getStewardshipStats();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(30);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#f97316", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase IV: Institutional Stewardship
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Automated Stewardship
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Scheduled reviews, compliance reminders, and recurring institutional work. Ensures nothing falls through the cracks.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Tasks" value={stats.totalTasks} color="#f8fafc" />
        <StatCard label="Scheduled" value={stats.byStatus.scheduled} color="#3b82f6" />
        <StatCard label="Completed" value={stats.byStatus.completed} color="#10b981" />
        <StatCard label="Overdue" value={stats.overdueCount} color="#ef4444" />
        <StatCard label="Completion Rate" value={`${stats.completionRate}%`} color="#8b5cf6" />
      </div>

      {/* Status Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="In Progress" value={stats.byStatus["in-progress"]} color="#8b5cf6" />
        <StatCard label="Pending" value={stats.byStatus.pending} color="#f59e0b" />
        <StatCard label="Upcoming (30 days)" value={upcomingTasks.length} color="#06b6d4" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Tasks by Type */}
        <WidgetCard title="Tasks by Type">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{type.replace(/-/g, " ")}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Overdue Tasks */}
        <WidgetCard title={`Overdue (${overdueTasks.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {overdueTasks.length === 0 ? (
              <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>✓ No overdue tasks</p>
            ) : (
              overdueTasks.slice(0, 5).map((task) => (
                <div key={task.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #ef444440" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{task.title}</p>
                    <StatusBadge status="overdue" />
                  </div>
                  <p style={{ fontSize: 11, color: "#ef4444", margin: 0 }}>
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <WidgetCard title={`Upcoming Tasks (${upcomingTasks.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingTasks.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </WidgetCard>
        </div>
      )}

      {/* All Tasks */}
      <WidgetCard title={`All Tasks (${tasks.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No scheduled tasks yet. Automated stewardship tasks will appear here.
            </p>
          ) : (
            tasks.slice(0, 10).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
