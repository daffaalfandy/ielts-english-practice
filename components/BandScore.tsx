"use client";

interface BandScoreProps {
  score: number;
  label?: string;
  size?: "sm" | "lg";
}

export function BandScore({ score, label, size = "sm" }: BandScoreProps) {
  const percentage = ((score - 1) / 8) * 100;

  const getGradient = (score: number) => {
    if (score >= 7) return "from-emerald-400 to-teal-500";
    if (score >= 5.5) return "from-amber-300 to-yellow-500";
    if (score >= 4) return "from-orange-400 to-rose-500";
    return "from-rose-400 to-red-600";
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-semibold tabular-nums">{score}</span>
        </div>
      )}
      <div className="relative">
        <div
          className={`${size === "lg" ? "h-2.5" : "h-2"} bg-white/5 rounded-full overflow-hidden ring-1 ring-white/5`}
        >
          <div
            className={`h-full bg-gradient-to-r ${getGradient(score)} rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(255,255,255,0.15)]`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {size === "lg" && (
          <div className="flex justify-between mt-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span
                key={n}
                className={`text-[10px] tabular-nums ${
                  n === Math.round(score)
                    ? "font-bold text-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface OverallBandProps {
  score: number;
}

export function OverallBand({ score }: OverallBandProps) {
  const getColor = (score: number) => {
    if (score >= 7)
      return {
        ring: "ring-emerald-400/40",
        bg: "from-emerald-400/20 to-teal-500/20",
        text: "text-emerald-300",
        glow: "shadow-emerald-500/30",
      };
    if (score >= 5.5)
      return {
        ring: "ring-amber-400/40",
        bg: "from-amber-300/20 to-yellow-500/20",
        text: "text-amber-300",
        glow: "shadow-amber-500/30",
      };
    if (score >= 4)
      return {
        ring: "ring-orange-400/40",
        bg: "from-orange-400/20 to-rose-500/20",
        text: "text-orange-300",
        glow: "shadow-orange-500/30",
      };
    return {
      ring: "ring-rose-400/40",
      bg: "from-rose-400/20 to-red-600/20",
      text: "text-rose-300",
      glow: "shadow-rose-500/30",
    };
  };

  const c = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
        Overall Band
      </span>
      <div
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${c.bg} ring-2 ${c.ring} shadow-lg ${c.glow} flex items-center justify-center backdrop-blur-sm`}
      >
        <span className={`text-3xl font-bold tabular-nums ${c.text}`}>
          {score}
        </span>
      </div>
    </div>
  );
}
