interface AIProgressBarProps {
  completed: number;
  total: number;
  name: string;
}

export function AIProgressBar({ completed, total, name }: AIProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="ai-progress-labels">
        <span className="ai-progress-name">{name}</span>
        <span className="ai-progress-count">
          {completed} of {total} modules complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-valuetext={`${completed} of ${total} modules complete`}
        aria-label={`${name} progress`}
        className="ai-progress-track"
      >
        <div className="ai-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
