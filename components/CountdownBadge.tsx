"use client";

import { Clock, AlertTriangle } from "lucide-react";

interface CountdownBadgeProps {
  /** Seconds remaining. Caller is responsible for the countdown itself. */
  remainingSeconds: number;
  /** Short label shown before the time (e.g. "Task 1"). */
  label?: string;
  /** Seconds at or below which the amber "warning" tone kicks in. Default 60. */
  warnAtSeconds?: number;
}

export function CountdownBadge({
  remainingSeconds,
  label,
  warnAtSeconds = 60,
}: CountdownBadgeProps) {
  const safe = Math.max(0, Math.floor(remainingSeconds));
  const expired = safe === 0;
  const warning = !expired && safe <= warnAtSeconds;
  const mm = Math.floor(safe / 60);
  const ss = safe % 60;

  const tone = expired
    ? "border-rose-400/40 text-rose-300 bg-rose-500/10"
    : warning
      ? "border-amber-400/40 text-amber-300 bg-amber-500/10"
      : "border-white/15 text-muted-foreground bg-white/5";

  const Icon = expired ? AlertTriangle : Clock;

  return (
    <span
      role="timer"
      aria-label={label ? `${label} remaining` : "Time remaining"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 text-xs tabular-nums font-medium ${tone}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden />
      {label && (
        <span className="uppercase tracking-wider text-[10px] opacity-80">
          {label}
        </span>
      )}
      <span>
        {mm}:{ss.toString().padStart(2, "0")}
      </span>
    </span>
  );
}
