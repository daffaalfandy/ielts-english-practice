"use client";

import { createElement, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type {
  MapAreaFill,
  MapFeature,
  MapView,
  MapVisualData,
} from "@/lib/ielts-data";

// ─────────────────────────────────────────────────────────────────
// Layout constants. Pixel size is derived from the cell count so the
// SVG scales predictably across prompts.

const CELL_PX = 36;
const PADDING = 16;
const BUILDING_RADIUS = 3;
const ROAD_STROKE = CELL_PX * 0.55;
const ROAD_CENTERLINE = CELL_PX * 0.08;

const AREA_FILLS: Record<
  MapAreaFill,
  { fill: string; stroke: string; pattern?: "hatch" | "wave" | "dots" }
> = {
  park: { fill: "rgba(52,211,153,0.28)", stroke: "rgba(52,211,153,0.55)", pattern: "hatch" },
  water: { fill: "rgba(56,189,248,0.28)", stroke: "rgba(56,189,248,0.55)", pattern: "wave" },
  parking: { fill: "rgba(148,163,184,0.22)", stroke: "rgba(148,163,184,0.5)", pattern: "dots" },
  plaza: { fill: "rgba(251,191,36,0.22)", stroke: "rgba(251,191,36,0.5)" },
};

// Resolve lucide icons through a module-level cache so lookups are cheap.
const iconCache = new Map<string, LucideIcon | null>();
function resolveIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  if (iconCache.has(name)) return iconCache.get(name) ?? null;
  const lib = LucideIcons as unknown as Record<string, LucideIcon>;
  const icon = lib[name] ?? null;
  iconCache.set(name, icon);
  return icon;
}

function LucideIconRender({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = resolveIcon(name);
  if (!Icon) return null;
  // See process-block.tsx for rationale — createElement avoids the
  // static-components lint heuristic on stable module-level exports.
  return createElement(Icon, { className });
}

// ─────────────────────────────────────────────────────────────────

export function MapBlock({ data }: { data: MapVisualData }) {
  const { cols, rows } = data.grid;
  const width = cols * CELL_PX + PADDING * 2;
  const height = rows * CELL_PX + PADDING * 2;

  const searchParams = useSearchParams();
  const debug = searchParams?.get("debug-map") === "1";

  // Identify features that changed between the two views so the renderer can
  // highlight them. For single-view maps this is empty.
  const changedIds = useMemo(() => {
    if (data.views.length !== 2) return new Set<string>();
    const [a, b] = data.views;
    const changed = new Set<string>();
    const aById = new Map(a.features.map((f) => [f.id, f]));
    const bById = new Map(b.features.map((f) => [f.id, f]));
    for (const id of new Set([...aById.keys(), ...bById.keys()])) {
      const fa = aById.get(id);
      const fb = bById.get(id);
      if (!fa || !fb) {
        changed.add(id);
        continue;
      }
      if (JSON.stringify(fa) !== JSON.stringify(fb)) changed.add(id);
    }
    return changed;
  }, [data.views]);

  const multiView = data.views.length > 1;

  return (
    <div className="rounded-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{data.title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Map · {data.grid.cols}×{data.grid.rows} grid
            {multiView && " · before/after comparison"}
          </p>
        </div>
        <Compass />
      </div>

      <div
        className={`grid gap-4 ${
          multiView ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {data.views.map((view, i) => (
          <MapViewSvg
            key={i}
            view={view}
            width={width}
            height={height}
            gridCols={cols}
            gridRows={rows}
            changedIds={changedIds}
            debug={debug}
          />
        ))}
      </div>

      <Legend views={data.views} />
    </div>
  );
}

// ─── View ────────────────────────────────────────────────────────

function MapViewSvg({
  view,
  width,
  height,
  gridCols,
  gridRows,
  changedIds,
  debug,
}: {
  view: MapView;
  width: number;
  height: number;
  gridCols: number;
  gridRows: number;
  changedIds: Set<string>;
  debug: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        {view.label}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Map: ${view.label}`}
          className="w-full h-auto rounded-lg bg-[rgba(15,20,30,0.55)] ring-1 ring-white/10"
          style={{ maxWidth: width }}
        >
          <Defs />
          {debug && (
            <DebugGrid cols={gridCols} rows={gridRows} width={width} height={height} />
          )}
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            {/* Render areas first (background), then roads, then buildings, then markers. */}
            {view.features
              .filter((f) => f.kind === "area")
              .map((f) => (
                <AreaFeature
                  key={f.id}
                  feature={f}
                  highlighted={changedIds.has(f.id)}
                />
              ))}
            {view.features
              .filter((f) => f.kind === "road")
              .map((f) => (
                <RoadFeature
                  key={f.id}
                  feature={f}
                  highlighted={changedIds.has(f.id)}
                />
              ))}
            {view.features
              .filter((f) => f.kind === "building")
              .map((f) => (
                <BuildingFeature
                  key={f.id}
                  feature={f}
                  highlighted={changedIds.has(f.id)}
                />
              ))}
            {view.features
              .filter((f) => f.kind === "marker")
              .map((f) => (
                <MarkerFeature
                  key={f.id}
                  feature={f}
                  highlighted={changedIds.has(f.id)}
                />
              ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

// ─── Defs: shared SVG patterns ──────────────────────────────────

function Defs() {
  return (
    <defs>
      <pattern
        id="pat-hatch"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(52,211,153,0.6)" strokeWidth="1.5" />
      </pattern>
      <pattern id="pat-wave" patternUnits="userSpaceOnUse" width="16" height="8">
        <path
          d="M 0 4 Q 4 0 8 4 T 16 4"
          fill="none"
          stroke="rgba(56,189,248,0.7)"
          strokeWidth="1"
        />
      </pattern>
      <pattern id="pat-dots" patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="4" cy="4" r="1" fill="rgba(148,163,184,0.6)" />
      </pattern>
      <filter id="highlight-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// ─── Debug grid ─────────────────────────────────────────────────

function DebugGrid({
  cols,
  rows,
  width,
  height,
}: {
  cols: number;
  rows: number;
  width: number;
  height: number;
}) {
  const lines: React.ReactNode[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = PADDING + c * CELL_PX;
    lines.push(
      <line
        key={`v${c}`}
        x1={x}
        y1={PADDING}
        x2={x}
        y2={height - PADDING}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />
    );
  }
  for (let r = 0; r <= rows; r++) {
    const y = PADDING + r * CELL_PX;
    lines.push(
      <line
        key={`h${r}`}
        x1={PADDING}
        y1={y}
        x2={width - PADDING}
        y2={y}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />
    );
  }
  const labels: React.ReactNode[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      labels.push(
        <text
          key={`l${c}-${r}`}
          x={PADDING + c * CELL_PX + 4}
          y={PADDING + r * CELL_PX + 10}
          fontSize={8}
          fill="rgba(255,255,255,0.25)"
        >
          {c},{r}
        </text>
      );
    }
  }
  return (
    <g aria-hidden>
      {lines}
      {labels}
    </g>
  );
}

// ─── Feature renderers ───────────────────────────────────────────

type FeatureProps<T extends MapFeature> = {
  feature: T;
  highlighted: boolean;
};

function highlightRing(highlighted: boolean) {
  return highlighted
    ? { filter: "url(#highlight-glow)" as const, stroke: "rgba(251,191,36,0.9)" }
    : {};
}

function BuildingFeature({
  feature,
  highlighted,
}: FeatureProps<Extract<MapFeature, { kind: "building" }>>) {
  const { x, y, w, h } = feature.cells;
  const px = x * CELL_PX;
  const py = y * CELL_PX;
  const pw = w * CELL_PX;
  const ph = h * CELL_PX;
  const h2 = highlightRing(highlighted);
  return (
    <g>
      <rect
        x={px}
        y={py}
        width={pw}
        height={ph}
        rx={BUILDING_RADIUS}
        fill="rgba(167,139,250,0.22)"
        stroke={h2.stroke ?? "rgba(167,139,250,0.7)"}
        strokeWidth={highlighted ? 2 : 1.5}
        filter={h2.filter}
      />
      <text
        x={px + pw / 2}
        y={py + ph / 2}
        fontSize={11}
        fontWeight={600}
        fill="rgba(255,255,255,0.92)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {feature.label}
      </text>
    </g>
  );
}

function AreaFeature({
  feature,
  highlighted,
}: FeatureProps<Extract<MapFeature, { kind: "area" }>>) {
  const { x, y, w, h } = feature.cells;
  const px = x * CELL_PX;
  const py = y * CELL_PX;
  const pw = w * CELL_PX;
  const ph = h * CELL_PX;
  const style = AREA_FILLS[feature.fill];
  const h2 = highlightRing(highlighted);
  return (
    <g>
      <rect
        x={px}
        y={py}
        width={pw}
        height={ph}
        rx={BUILDING_RADIUS}
        fill={style.fill}
        stroke={h2.stroke ?? style.stroke}
        strokeWidth={highlighted ? 2 : 1.25}
        filter={h2.filter}
      />
      {style.pattern && (
        <rect
          x={px}
          y={py}
          width={pw}
          height={ph}
          rx={BUILDING_RADIUS}
          fill={`url(#pat-${style.pattern})`}
          pointerEvents="none"
        />
      )}
      <text
        x={px + pw / 2}
        y={py + ph / 2}
        fontSize={10}
        fontWeight={500}
        fill="rgba(255,255,255,0.88)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {feature.label}
      </text>
    </g>
  );
}

function RoadFeature({
  feature,
  highlighted,
}: FeatureProps<Extract<MapFeature, { kind: "road" }>>) {
  const pts = feature.path
    .map(([x, y]) => `${x * CELL_PX},${y * CELL_PX}`)
    .join(" ");
  const h2 = highlightRing(highlighted);
  const midpoint = feature.path[Math.floor(feature.path.length / 2)];
  return (
    <g filter={h2.filter}>
      <polyline
        points={pts}
        fill="none"
        stroke={h2.stroke ?? "rgba(148,163,184,0.45)"}
        strokeWidth={ROAD_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={ROAD_CENTERLINE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 6"
      />
      {feature.label && midpoint && (
        <text
          x={midpoint[0] * CELL_PX}
          y={midpoint[1] * CELL_PX - ROAD_STROKE / 2 - 4}
          fontSize={10}
          fontWeight={600}
          fill="rgba(255,255,255,0.85)"
          textAnchor="middle"
        >
          {feature.label}
        </text>
      )}
    </g>
  );
}

function MarkerFeature({
  feature,
  highlighted,
}: FeatureProps<Extract<MapFeature, { kind: "marker" }>>) {
  const cx = feature.cell.x * CELL_PX + CELL_PX / 2;
  const cy = feature.cell.y * CELL_PX + CELL_PX / 2;
  const hasIcon = resolveIcon(feature.icon) !== null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={CELL_PX * 0.32}
        fill="rgba(251,113,133,0.28)"
        stroke={highlighted ? "rgba(251,191,36,0.9)" : "rgba(251,113,133,0.8)"}
        strokeWidth={highlighted ? 2.25 : 1.5}
        filter={highlighted ? "url(#highlight-glow)" : undefined}
      />
      {hasIcon ? (
        <foreignObject
          x={cx - 9}
          y={cy - 9}
          width={18}
          height={18}
          aria-hidden
          style={{ pointerEvents: "none" }}
        >
          <div className="w-full h-full flex items-center justify-center text-rose-100">
            <LucideIconRender name={feature.icon} className="w-4 h-4" />
          </div>
        </foreignObject>
      ) : (
        <circle cx={cx} cy={cy} r={2.5} fill="rgba(251,113,133,0.9)" />
      )}
      <text
        x={cx}
        y={cy + CELL_PX * 0.32 + 12}
        fontSize={10}
        fontWeight={600}
        fill="rgba(255,255,255,0.88)"
        textAnchor="middle"
      >
        {feature.label}
      </text>
    </g>
  );
}

// ─── Compass + Legend ───────────────────────────────────────────

function Compass() {
  return (
    <div
      className="shrink-0 w-10 h-10 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center relative"
      aria-label="North points up"
      title="North ↑"
    >
      <span className="text-[10px] font-bold text-muted-foreground absolute top-0.5">N</span>
      <span className="text-[9px] text-muted-foreground/60 absolute bottom-0.5">S</span>
      <span className="text-[9px] text-muted-foreground/60 absolute left-1">W</span>
      <span className="text-[9px] text-muted-foreground/60 absolute right-1">E</span>
    </div>
  );
}

function Legend({ views }: { views: MapView[] }) {
  const kinds = new Set<string>();
  const fills = new Set<MapAreaFill>();
  for (const v of views) {
    for (const f of v.features) {
      kinds.add(f.kind);
      if (f.kind === "area") fills.add(f.fill);
    }
  }

  const items: Array<{ label: string; swatch: React.ReactNode }> = [];
  if (kinds.has("building"))
    items.push({
      label: "Building",
      swatch: (
        <span className="inline-block w-3 h-3 rounded-sm bg-violet-400/30 ring-1 ring-violet-400/70" />
      ),
    });
  for (const fill of fills) {
    const style = AREA_FILLS[fill];
    items.push({
      label: cap(fill),
      swatch: (
        <span
          className="inline-block w-3 h-3 rounded-sm ring-1"
          style={{ background: style.fill, borderColor: style.stroke }}
        />
      ),
    });
  }
  if (kinds.has("road"))
    items.push({
      label: "Road",
      swatch: (
        <span className="inline-block w-4 h-1.5 rounded-full bg-slate-400/60" />
      ),
    });
  if (kinds.has("marker"))
    items.push({
      label: "Landmark",
      swatch: (
        <span className="inline-block w-3 h-3 rounded-full bg-rose-400/40 ring-1 ring-rose-400/80" />
      ),
    });
  if (views.length > 1)
    items.push({
      label: "Changed",
      swatch: (
        <span className="inline-block w-3 h-3 rounded-sm ring-2 ring-amber-400/80" />
      ),
    });

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 mt-3 border-t border-white/5 text-[11px] text-muted-foreground">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.swatch}
          {it.label}
        </span>
      ))}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
