"use client";

import { Check } from "lucide-react";

interface WordCounterProps {
  text: string;
  minWords: number;
}

export function WordCounter({ text, minWords }: WordCounterProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const meetsMinimum = wordCount >= minWords;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ring-1 transition-colors ${
        meetsMinimum
          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
          : "bg-white/5 text-muted-foreground ring-white/10"
      }`}
    >
      <span className="font-semibold tabular-nums">{wordCount}</span>
      <span className="opacity-70">/ {minWords} words</span>
      {meetsMinimum && <Check className="w-3 h-3" />}
    </div>
  );
}
