import Sidebar from "@/components/Sidebar";

const components = [
  {
    name: "Button",
    description: "Interactive button with variants for primary, secondary, and ghost styles.",
    variants: ["primary", "secondary", "ghost", "danger"],
    sizes: ["sm", "md", "lg"],
  },
  {
    name: "Card",
    description: "Container component for grouping related content with optional header and footer.",
    variants: ["default", "elevated", "outlined"],
    sizes: ["sm", "md", "lg"],
  },
  {
    name: "Badge",
    description: "Status indicator for labels, categories, and counts.",
    variants: ["default", "brand", "success", "warning", "danger"],
    sizes: ["sm", "md"],
  },
  {
    name: "Input",
    description: "Text input field with label, helper text, and validation states.",
    variants: ["default", "error", "success"],
    sizes: ["sm", "md", "lg"],
  },
  {
    name: "Avatar",
    description: "User avatar with image, initials, or fallback icon.",
    variants: ["image", "initials", "icon"],
    sizes: ["xs", "sm", "md", "lg", "xl"],
  },
  {
    name: "Alert",
    description: "Status message with icon, title, and description.",
    variants: ["info", "success", "warning", "danger"],
    sizes: ["md"],
  },
  {
    name: "Modal",
    description: "Overlay dialog for focused interactions and confirmations.",
    variants: ["default", "fullscreen"],
    sizes: ["sm", "md", "lg"],
  },
  {
    name: "Table",
    description: "Data table with sorting, filtering, and pagination support.",
    variants: ["default", "striped", "compact"],
    sizes: ["md"],
  },
];

export default function ComponentsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Components</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            BDL primitive components with specs, tokens, and usage examples.
          </p>

          <div className="space-y-8">
            {components.map((comp) => (
              <div
                key={comp.name}
                className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{comp.name}</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{comp.description}</p>
                  </div>
                  <code className="text-xs bg-[var(--bg-subtle)] px-2 py-1 rounded font-mono">
                    @bhavya/bdl
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Variants</h3>
                    <div className="flex flex-wrap gap-2">
                      {comp.variants.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-1 text-xs rounded-md bg-[var(--bg-muted)] text-[var(--text)]"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {comp.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 text-xs rounded-md bg-[var(--bg-muted)] text-[var(--text)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-[var(--bg-subtle)]">
                  <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Usage</h3>
                  <code className="text-sm font-mono text-[var(--text)]">
{`import { ${comp.name} } from "@bhavya/bdl";

<${comp.name} variant="primary" size="md">
  Click me
</${comp.name}>`}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
