import type { DiagramSpec } from "@/data/curriculum";

const INK = "var(--color-text-primary)";
const MUTED = "var(--color-text-secondary)";
const LINE = "var(--color-viz-forest-border)";
const ACCENT = "var(--color-accent-gold)";
const NODE_BG = "var(--color-bg-elevated)";

const FONT: React.CSSProperties = { fontFamily: "var(--font-sans)", fill: INK };

function Chain({ steps, cyclic }: { steps: string[]; cyclic?: boolean }) {
  const w = 160,
    h = 72,
    gap = 64;
  const _width =
    steps.length * w + (steps.length - 1) * gap + (cyclic ? gap : 0);
  return (
    <g>
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            <rect
              x={x}
              y={40}
              width={w}
              height={h}
              rx={8}
              fill={NODE_BG}
              stroke={LINE}
            />
            <foreignObject x={x + 8} y={48} width={w - 16} height={h - 16}>
              <div style={{ ...FONT, fontSize: 13, textAlign: "center" }}>
                {s}
              </div>
            </foreignObject>
            {i < steps.length - 1 && (
              <line
                x1={x + w}
                y1={40 + h / 2}
                x2={x + w + gap - 8}
                y2={40 + h / 2}
                stroke={ACCENT}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
            {cyclic && i === steps.length - 1 && (
              <path
                d={`M ${x + w / 2} 40 C ${x + w / 2} 0, ${steps.length * (w + gap) - w / 2} 0, ${steps.length * (w + gap) - w / 2} 40`}
                fill="none"
                stroke={ACCENT}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function DiagramRenderer({ spec }: { spec: DiagramSpec }) {
  const titleId = `dg-${spec.title.replace(/\W+/g, "-").toLowerCase()}`;
  let body: React.ReactNode = null;
  let _width = 800;
  switch (spec.kind) {
    case "flow":
    case "pipeline":
      _width = spec.steps.length * 224;
      body = <Chain steps={spec.steps} />;
      break;
    case "cycle":
      _width = spec.steps.length * 224;
      body = <Chain steps={spec.steps} cyclic />;
      break;
    case "timeline": {
      const step = 760 / Math.max(1, spec.points.length - 1 || 1);
      _width = 800;
      body = (
        <g>
          <line
            x1={20}
            y1={90}
            x2={780}
            y2={90}
            stroke={LINE}
            strokeWidth={2}
          />
          {spec.points.map((p, i) => {
            const x = spec.points.length === 1 ? 400 : 20 + i * step;
            return (
              <g key={p.label}>
                <circle cx={x} cy={90} r={6} fill={ACCENT} />
                <foreignObject x={x - 70} y={100} width={140} height={80}>
                  <div style={{ ...FONT, fontSize: 12, textAlign: "center" }}>
                    <strong>{p.label}</strong>
                    {p.note && <div style={{ color: MUTED }}>{p.note}</div>}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      );
      break;
    }
    case "compare":
      _width = 800;
      body = (
        <g>
          {[spec.left, spec.right].map((col, i) => (
            <g key={col.label} transform={`translate(${i * 410},0)`}>
              <rect
                x={0}
                y={16}
                width={390}
                height={36 + col.items.length * 28}
                rx={8}
                fill={NODE_BG}
                stroke={LINE}
              />
              <foreignObject x={12} y={24} width={366} height={24}>
                <div style={{ ...FONT, fontWeight: 600 }}>{col.label}</div>
              </foreignObject>
              {col.items.map((it, j) => (
                <foreignObject
                  key={it}
                  x={12}
                  y={52 + j * 28}
                  width={366}
                  height={26}
                >
                  <div style={{ ...FONT, fontSize: 13 }}>• {it}</div>
                </foreignObject>
              ))}
            </g>
          ))}
        </g>
      );
      break;
    case "network": {
      const cols = Math.ceil(Math.sqrt(spec.nodes.length));
      _width = 800;
      const pos = spec.nodes.map((n, i) => ({
        n,
        x: 80 + (i % cols) * (640 / Math.max(1, cols - 1 || 1)),
        y: 40 + Math.floor(i / cols) * 120,
      }));
      body = (
        <g>
          {spec.edges.map(([a, b]) => {
            const pa = pos.find((p) => p.n === a),
              pb = pos.find((p) => p.n === b);
            if (!pa || !pb) return null;
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={LINE}
                strokeWidth={2}
              />
            );
          })}
          {pos.map((p) => (
            <g key={p.n}>
              <circle
                cx={p.x}
                cy={p.y}
                r={34}
                fill={NODE_BG}
                stroke={ACCENT}
                strokeWidth={2}
              />
              <foreignObject x={p.x - 44} y={p.y - 14} width={88} height={28}>
                <div style={{ ...FONT, fontSize: 12, textAlign: "center" }}>
                  {p.n}
                </div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
    }
    case "bar-chart": {
      const max = Math.max(...spec.bars.map((b) => b.value), 1);
      _width = 800;
      body = (
        <g>
          {spec.bars.map((b, i) => (
            <g key={b.label}>
              <rect
                x={80}
                y={24 + i * 44}
                width={(b.value / max) * 620}
                height={26}
                fill={ACCENT}
                opacity={0.85}
                rx={4}
              />
              <foreignObject x={0} y={24 + i * 44} width={76} height={26}>
                <div style={{ ...FONT, fontSize: 12, textAlign: "right" }}>
                  {b.label}
                </div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
    }
    case "labeled-photo":
      _width = 800;
      body = (
        <g>
          <image
            href={spec.src}
            x={0}
            y={0}
            width={800}
            height={420}
            preserveAspectRatio="xMidYMid slice"
          />
          {spec.labels.map((l) => (
            <g key={l.text}>
              <circle
                cx={l.x * 8}
                cy={l.y * 4.2}
                r={5}
                fill={ACCENT}
                stroke="var(--color-bg-primary)"
              />
              <foreignObject
                x={l.x * 8 + 10}
                y={l.y * 4.2 - 12}
                width={180}
                height={24}
              >
                <div style={{ ...FONT, fontSize: 13 }}>{l.text}</div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
  }
  return (
    <figure aria-label={spec.title} style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${_width} 220`}
        width="100%"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{spec.title}</title>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>
        {body}
      </svg>
      <figcaption
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: MUTED,
          marginTop: "var(--space-4)",
        }}
      >
        {spec.title}
      </figcaption>
    </figure>
  );
}
