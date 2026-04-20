"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ModeLanding } from "./_components/mode-landing";
import { Part1Flow } from "./_components/part1-flow";
import { Part2Flow } from "./_components/part2-flow";
import { Part3Flow } from "./_components/part3-flow";
import { FullTestFlow } from "./_components/full-test-flow";

const modeLabels: Record<string, string> = {
  part1: "Part 1 — Personal Q&A",
  part2: "Part 2 — Cue Card",
  part3: "Part 3 — Discussion",
  full: "Full Speaking Test",
};

function SpeakingPageInner() {
  const params = useSearchParams();
  const mode = params.get("mode");

  if (!mode || !modeLabels[mode]) {
    return <ModeLanding />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link
          href="/speaking"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All modes
        </Link>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {modeLabels[mode]}
        </span>
      </div>
      {mode === "part1" && <Part1Flow />}
      {mode === "part2" && <Part2Flow />}
      {mode === "part3" && <Part3Flow />}
      {mode === "full" && <FullTestFlow />}
    </div>
  );
}

export default function SpeakingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <Suspense
            fallback={
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <SpeakingPageInner />
          </Suspense>
        </div>
      </main>
    </>
  );
}
