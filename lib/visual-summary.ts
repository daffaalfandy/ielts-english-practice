// Produces a plain-English summary of a Task 1 visual, for injection into the
// examiner prompt. IELTS marking hinges on whether the candidate described
// the *right* features — so the model needs to know what the visual says
// without us relying on it to spatially parse grid JSON.

import type {
  Task1VisualData,
  MapView,
  MapFeature,
  ProcessVisualData,
  MapVisualData,
} from "./ielts-data";

export function describeVisual(data: Task1VisualData): string {
  switch (data.type) {
    case "bar":
    case "line":
    case "pie":
    case "table":
      // These types are already self-explanatory as JSON. Return an empty
      // summary so the API route falls back to raw JSON only.
      return "";
    case "process":
      return describeProcess(data);
    case "map":
      return describeMap(data);
  }
}

function describeProcess(data: ProcessVisualData): string {
  const n = data.steps.length;
  const stageList = data.steps
    .map((s, i) => `${i + 1}. ${s.label}${s.description ? ` — ${s.description}` : ""}`)
    .join("\n");
  return [
    `This is a process diagram titled "${data.title}".`,
    `The process is linear and has ${n} stages, in order:`,
    stageList,
    `The candidate should describe each stage using sequencing language (first, then, next, after that, finally) and passive voice where appropriate.`,
  ].join("\n");
}

function describeMap(data: MapVisualData): string {
  const header = `This is a map titled "${data.title}". The grid is ${data.grid.cols} columns wide and ${data.grid.rows} rows tall (origin top-left).`;

  if (data.views.length === 1) {
    const view = data.views[0];
    return [header, describeMapView(view, data.grid)].join("\n\n");
  }

  // Multi-view: describe each and call out differences explicitly.
  const viewsBlock = data.views
    .map((v) => describeMapView(v, data.grid))
    .join("\n\n");

  const diffs = diffViews(data.views);
  const diffBlock = diffs.length
    ? `\n\nKey differences the candidate should mention:\n${diffs.map((d) => `- ${d}`).join("\n")}`
    : "";

  return `${header}\n\n${viewsBlock}${diffBlock}`;
}

function describeMapView(
  view: MapView,
  grid: { cols: number; rows: number }
): string {
  const lines: string[] = [`=== ${view.label} ===`];
  for (const f of view.features) {
    lines.push(describeFeature(f, grid));
  }
  return lines.join("\n");
}

function describeFeature(
  f: MapFeature,
  grid: { cols: number; rows: number }
): string {
  switch (f.kind) {
    case "building": {
      const { x, y, w, h } = f.cells;
      const region = cellRegion(x + w / 2, y + h / 2, grid);
      return `- Building "${f.label}" in the ${region} (occupies a ${w}×${h} area).`;
    }
    case "area": {
      const { x, y, w, h } = f.cells;
      const region = cellRegion(x + w / 2, y + h / 2, grid);
      return `- ${capitalize(f.fill)} "${f.label}" in the ${region} (${w}×${h}).`;
    }
    case "road": {
      const endpoints = `from (${f.path[0][0]},${f.path[0][1]}) to (${f.path[f.path.length - 1][0]},${f.path[f.path.length - 1][1]})`;
      const orientation = roadOrientation(f.path);
      return `- Road${f.label ? ` "${f.label}"` : ""} running ${orientation}, ${endpoints}.`;
    }
    case "marker": {
      const region = cellRegion(f.cell.x, f.cell.y, grid);
      return `- Landmark "${f.label}" in the ${region}.`;
    }
  }
}

/** Describes a grid cell's position in compass terms (NW, N, NE, …). */
function cellRegion(
  x: number,
  y: number,
  grid: { cols: number; rows: number }
): string {
  const col = x / grid.cols; // 0..1
  const row = y / grid.rows;
  const v = row < 1 / 3 ? "north" : row > 2 / 3 ? "south" : "central";
  const h = col < 1 / 3 ? "west" : col > 2 / 3 ? "east" : "central";
  if (v === "central" && h === "central") return "centre";
  if (v === "central") return h;
  if (h === "central") return v;
  return `${v}-${h}`;
}

function roadOrientation(path: Array<[number, number]>): string {
  const [x0, y0] = path[0];
  const [x1, y1] = path[path.length - 1];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  if (dx > dy * 2) return "east–west";
  if (dy > dx * 2) return "north–south";
  return "diagonally";
}

function diffViews(views: MapView[]): string[] {
  if (views.length !== 2) return [];
  const [a, b] = views;
  const aIds = new Set(a.features.map((f) => f.id));
  const bIds = new Set(b.features.map((f) => f.id));
  const diffs: string[] = [];

  for (const f of a.features) {
    if (!bIds.has(f.id)) {
      diffs.push(`"${featureLabel(f)}" exists in ${a.label} but not in ${b.label} (removed).`);
    }
  }
  for (const f of b.features) {
    if (!aIds.has(f.id)) {
      diffs.push(`"${featureLabel(f)}" exists in ${b.label} but not in ${a.label} (added).`);
    }
  }

  // Same id but kind or position changed → transformation.
  for (const fa of a.features) {
    const fb = b.features.find((x) => x.id === fa.id);
    if (!fb) continue;
    if (fa.kind !== fb.kind) {
      diffs.push(
        `"${featureLabel(fa)}" was a ${fa.kind} in ${a.label} and is a ${fb.kind} in ${b.label} (converted).`
      );
      continue;
    }
    if (!samePosition(fa, fb)) {
      diffs.push(`"${featureLabel(fa)}" was repositioned between ${a.label} and ${b.label}.`);
    } else if (featureLabel(fa) !== featureLabel(fb)) {
      diffs.push(`"${featureLabel(fa)}" was renamed to "${featureLabel(fb)}" in ${b.label}.`);
    }
  }

  return diffs;
}

function featureLabel(f: MapFeature): string {
  return "label" in f && f.label ? f.label : f.id;
}

function samePosition(a: MapFeature, b: MapFeature): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "building" || a.kind === "area") {
    const bb = b as typeof a;
    return (
      a.cells.x === bb.cells.x &&
      a.cells.y === bb.cells.y &&
      a.cells.w === bb.cells.w &&
      a.cells.h === bb.cells.h
    );
  }
  if (a.kind === "marker") {
    const bm = b as typeof a;
    return a.cell.x === bm.cell.x && a.cell.y === bm.cell.y;
  }
  if (a.kind === "road") {
    const br = b as typeof a;
    if (a.path.length !== br.path.length) return false;
    return a.path.every(
      ([x, y], i) => x === br.path[i][0] && y === br.path[i][1]
    );
  }
  return false;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
