import { Card, CardContent } from "@bhavya/ui";

export function MetricBars({ data }: { data: readonly { label: string; value: number }[] }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {data.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-mono text-[rgb(var(--muted-foreground))]">{item.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[rgb(var(--muted))]">
              <div className="h-full rounded-full bg-[rgb(var(--primary))]" data-value={item.value} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
