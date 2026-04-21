"use client";

import { createElement } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ProcessVisualData } from "@/lib/ielts-data";

// Linear process diagram. Cards wrap to a new row on narrow screens and
// arrows render between consecutive cards.

const ACCENTS = [
  "from-violet-400 to-fuchsia-400",
  "from-sky-400 to-indigo-400",
  "from-emerald-400 to-teal-400",
  "from-amber-400 to-orange-400",
  "from-rose-400 to-pink-400",
  "from-cyan-400 to-sky-400",
] as const;

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
  // Render via createElement rather than JSX. The `Icon` reference is a
  // stable lucide-react export (module-level), but the lint rule can't see
  // that through the indirection and flags JSX usage as "component created
  // during render." createElement sidesteps the heuristic.
  return createElement(Icon, { className });
}

export function ProcessBlock({ data }: { data: ProcessVisualData }) {
  return (
    <div className="rounded-xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">{data.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Process · {data.steps.length} stages
        </p>
      </div>

      <ol
        aria-label={data.title}
        className="flex flex-wrap items-stretch gap-x-2 gap-y-4"
      >
        {data.steps.map((step, i) => {
          const hasIcon = resolveIcon(step.icon) !== null;
          const accent = ACCENTS[i % ACCENTS.length];
          const isLast = i === data.steps.length - 1;

          return (
            <li
              key={i}
              className="flex items-stretch gap-2 flex-1 min-w-[160px] sm:min-w-[180px]"
            >
              <div className="flex-1 flex flex-col rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${accent} text-[11px] font-bold text-white shadow-md shrink-0`}
                    aria-hidden
                  >
                    {hasIcon ? (
                      <LucideIconRender name={step.icon} className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="text-xs font-semibold tracking-tight leading-snug">
                    {step.label}
                  </span>
                </div>
                {step.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
              {!isLast && (
                <ArrowRight
                  className="w-4 h-4 text-muted-foreground self-center shrink-0"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
