import { requirePolicy } from "@/lib/require-role";
import { getIOCActions } from "@/lib/os-data";
import { CheckSquare, Clock, User } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Action Items | Bhavya Foundation",
  description: "Institute of Compliance — action items and tasks",
};

export default async function IOCActionsPage() {
  await requirePolicy("/os/ioc");
  const actions = getIOCActions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/os/ioc"
          className="text-xs text-accent-gold hover:underline mb-2 inline-block"
        >
          _back to IOC
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Action Items
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          {actions.length} items ·{" "}
          {actions.filter((a) => a.status === "pending").length} pending
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="divide-y divide-border-primary">
          {actions.map((action) => (
            <div key={action.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckSquare
                      className={`w-4 h-4 flex-shrink-0 ${
                        action.status === "completed"
                          ? "text-green-400"
                          : "text-text-muted"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        action.status === "completed"
                          ? "text-text-muted line-through"
                          : "text-text-primary"
                      }`}
                    >
                      {action.title}
                    </span>
                  </div>
                  {action.description && (
                    <p className="text-xs text-text-muted ml-6">
                      {action.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      action.priority === "urgent"
                        ? "bg-red-500/10 text-red-400"
                        : action.priority === "high"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-accent-gold/10 text-accent-gold"
                    }`}
                  >
                    {action.priority}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      action.status === "completed"
                        ? "bg-green-500/10 text-green-400"
                        : action.status === "in_progress"
                          ? "bg-accent-gold/10 text-accent-gold"
                          : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {action.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 ml-6 text-[10px] text-text-muted">
                {action.assignee && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {action.assignee}
                  </span>
                )}
                {action.due_date && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {action.due_date}
                  </span>
                )}
              </div>
            </div>
          ))}
          {actions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-text-muted">No action items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
