"use client";

import { useCountdown } from "@/lib/use-countdown";

interface TimerProps {
  duration: number; // seconds
  onComplete: () => void;
  isRunning: boolean;
  label: string;
  color: "yellow" | "green" | "red";
}

export function Timer({
  duration,
  onComplete,
  isRunning,
  label,
  color,
}: TimerProps) {
  const { remaining } = useCountdown(duration, {
    isRunning,
    onExpire: onComplete,
  });

  const progress = duration > 0 ? remaining / duration : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const palettes = {
    yellow: {
      from: "#FBBF24",
      to: "#F59E0B",
      text: "text-amber-300",
      glow: "shadow-amber-500/30",
    },
    green: {
      from: "#34D399",
      to: "#10B981",
      text: "text-emerald-300",
      glow: "shadow-emerald-500/30",
    },
    red: {
      from: "#F87171",
      to: "#EF4444",
      text: "text-rose-300",
      glow: "shadow-rose-500/30",
    },
  };

  const dynamic =
    color === "green" && progress < 0.25 ? palettes.red : palettes[color];

  const gradientId = `timer-grad-${color}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <div
        className={`relative w-48 h-48 rounded-full shadow-2xl ${dynamic.glow}`}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={dynamic.from} />
              <stop offset="100%" stopColor={dynamic.to} />
            </linearGradient>
          </defs>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/10"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div
          role="timer"
          aria-label={label}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className={`text-4xl font-bold tabular-nums ${dynamic.text}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
