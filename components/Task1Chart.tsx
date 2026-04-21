"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BarVisualData,
  LineVisualData,
  PieVisualData,
  TableVisualData,
  Task1VisualData,
} from "@/lib/ielts-data";

const palette = [
  "#a78bfa", // violet
  "#38bdf8", // sky
  "#34d399", // emerald
  "#fbbf24", // amber
  "#fb7185", // rose
  "#c084fc", // lilac
];

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "rgba(20,20,30,0.92)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px",
};

const tooltipLabelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  marginBottom: 4,
};

const tooltipItemStyle: React.CSSProperties = {
  color: "#fff",
};

const axisStyle = {
  fontSize: 11,
  stroke: "rgba(255,255,255,0.55)",
} as const;

interface ChartShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function ChartShell({ title, subtitle, children }: ChartShellProps) {
  return (
    <div className="rounded-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function BarChartBlock({ data }: { data: BarVisualData }) {
  return (
    <ChartShell
      title={data.title}
      subtitle={
        data.xAxisLabel
          ? `${data.xAxisLabel} · ${data.yAxisLabel}`
          : data.yAxisLabel
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.data}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="category"
              fontSize={axisStyle.fontSize}
              stroke={axisStyle.stroke}
              interval={0}
              angle={data.data.length > 5 ? -20 : 0}
              textAnchor={data.data.length > 5 ? "end" : "middle"}
              height={data.data.length > 5 ? 54 : 30}
            />
            <YAxis
              fontSize={axisStyle.fontSize}
              stroke={axisStyle.stroke}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            {data.series.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={palette[i % palette.length]}
                stackId={data.stacked ? "stack" : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  );
}

function LineChartBlock({ data }: { data: LineVisualData }) {
  return (
    <ChartShell
      title={data.title}
      subtitle={
        data.xAxisLabel
          ? `${data.xAxisLabel} · ${data.yAxisLabel}`
          : data.yAxisLabel
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.data}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="period"
              fontSize={axisStyle.fontSize}
              stroke={axisStyle.stroke}
            />
            <YAxis fontSize={axisStyle.fontSize} stroke={axisStyle.stroke} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            {data.series.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={palette[i % palette.length]}
                strokeWidth={2.2}
                dot={{
                  r: 3,
                  fill: palette[i % palette.length],
                  strokeWidth: 0,
                }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  );
}

function PieChartBlock({ data }: { data: PieVisualData }) {
  // Build a stable color map keyed by category name so the SAME category
  // gets the SAME color across all pies in the series.
  const uniqueNames = Array.from(
    new Set(data.series.flatMap((s) => s.data.map((d) => d.name)))
  );
  const colorFor = (name: string) =>
    palette[uniqueNames.indexOf(name) % palette.length];

  const isMulti = data.series.length > 1;

  return (
    <ChartShell title={data.title}>
      <div
        className={`grid gap-4 ${
          isMulti ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {data.series.map((s, si) => (
          <div key={si} className="flex flex-col items-center">
            {isMulti && (
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {s.label}
              </p>
            )}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={s.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    labelLine={false}
                    style={{ fontSize: 10 }}
                  >
                    {s.data.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={colorFor(entry.name)}
                        stroke="rgba(20,20,30,0.6)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
      {isMulti && (
        <div className="flex flex-wrap gap-3 justify-center pt-2 text-[11px] text-muted-foreground">
          {uniqueNames.map((name) => (
            <span key={name} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: colorFor(name) }}
              />
              {name}
            </span>
          ))}
        </div>
      )}
    </ChartShell>
  );
}

function TableBlock({ data }: { data: TableVisualData }) {
  return (
    <ChartShell title={data.title}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {data.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-medium text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/10"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 ${
                      ci === 0 ? "font-medium" : "tabular-nums text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  );
}

export function Task1Chart({ data }: { data: Task1VisualData }) {
  switch (data.type) {
    case "bar":
      return <BarChartBlock data={data} />;
    case "line":
      return <LineChartBlock data={data} />;
    case "pie":
      return <PieChartBlock data={data} />;
    case "table":
      return <TableBlock data={data} />;
  }
}
