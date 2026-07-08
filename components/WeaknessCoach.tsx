"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStream } from "@/lib/use-stream";
import { categoryLabel } from "@/lib/grammar-taxonomy";
import type { ErrorAggregation } from "@/lib/error-aggregation";
import { Brain, Loader2, Sparkles, Target, ArrowRight } from "lucide-react";

interface CoachResult {
  top_weakness: { category: string; why: string };
  ranked_weaknesses: { category: string; note: string }[];
  study_plan: string[];
  drill_focus: string;
  encouragement: string;
}

export function WeaknessCoach({ agg }: { agg: ErrorAggregation }) {
  const router = useRouter();
  const { isLoading, error, result, submit } = useStream<CoachResult>();

  const analyze = useCallback(() => {
    const categories = agg.byCategory.slice(0, 6).map((c) => ({
      category: c.category,
      count: c.count,
      subtypes: c.subtypes,
      examples: c.recentExamples,
    }));
    submit("/api/weakness-coach", {
      categories,
      totalErrors: agg.totalErrors,
      totalSessions: agg.totalSessions,
    });
  }, [agg, submit]);

  const drillTop = useCallback(() => {
    const focus = result?.drill_focus || agg.byCategory[0]?.category;
    if (focus) router.push(`/grammar/drills?focus=${encodeURIComponent(focus)}`);
    else router.push("/grammar/drills");
  }, [result, agg, router]);

  return (
    <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 ring-white/10 mb-8">
      <div
        className="absolute -top-20 -left-16 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-400 to-sky-500 opacity-10 blur-3xl pointer-events-none"
        aria-hidden
      />
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              AI weakness coach
            </CardTitle>
            <CardDescription className="mt-1">
              Let AI read your full error history and name the one grammar
              weakness to fix next.
            </CardDescription>
          </div>
          {!result && (
            <Button size="sm" onClick={analyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Analyze
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {(result || error) && (
        <CardContent className="relative space-y-5">
          {error && (
            <p className="text-sm text-rose-300">
              {error} — try again in a moment.
            </p>
          )}

          {result && (
            <>
              {/* Top weakness */}
              <div className="rounded-xl bg-indigo-500/10 ring-1 ring-indigo-400/25 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-300">
                    Fix this first
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabel(result.top_weakness.category)}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">
                  {result.top_weakness.why}
                </p>
              </div>

              {/* Study plan */}
              {result.study_plan?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Your study plan</p>
                  <ol className="space-y-2">
                    {result.study_plan.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Ranked weaknesses */}
              {result.ranked_weaknesses?.length > 0 && (
                <div className="space-y-1.5">
                  {result.ranked_weaknesses.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-baseline gap-2 text-xs text-muted-foreground"
                    >
                      <span className="text-foreground font-medium">
                        {categoryLabel(w.category)}
                      </span>
                      <span>— {w.note}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.encouragement && (
                <p className="text-sm italic text-muted-foreground">
                  {result.encouragement}
                </p>
              )}

              <div className="flex justify-end">
                <Button size="sm" onClick={drillTop}>
                  Drill {categoryLabel(result.drill_focus)}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
