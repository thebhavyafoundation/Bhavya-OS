import { Card, CardContent } from "@bhavya/platform-ui";

export function InteractiveMapPlaceholder() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid min-h-[420px] place-items-center pt-6">
        <div className="max-w-md text-center">
          <p className="text-xl font-semibold">Interactive Map</p>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted-foreground))]">
            MapLibre-ready surface for forest restoration sites, watershed projects, native species zones, and volunteer activity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
