"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStream } from "@/lib/use-stream";
import { aggregateErrors } from "@/lib/error-aggregation";
import {
  saveSession,
  type DrillExercise,
  type DrillSession,
} from "@/lib/storage";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  X,
} from "lucide-react";

interface DrillApiResponse {
  exercises: DrillExercise[];
}

type Phase = "loading-focus" | "no-history" | "ready" | "drilling" | "done";

// Deterministic shuffle keyed on a string so option order is stable per-exercise
function shuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 9301 + 49297) % 233280;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function GrammarDrillsPage() {
  const [phase, setPhase] = useState<Phase>("loading-focus");
  const [focusCategories, setFocusCategories] = useState<string[]>([]);
  const [recentExamples, setRecentExamples] = useState<
    { error: string; correction: string }[]
  >([]);
  const [exercises, setExercises] = useState<DrillExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const savedRef = useRef(false);

  const {
    isLoading,
    error,
    rawText,
    result,
    submit,
    reset: resetStream,
  } = useStream<DrillApiResponse>();

  // Load focus list on mount
  useEffect(() => {
    const agg = aggregateErrors();
    if (agg.byCategory.length === 0) {
      setPhase("no-history");
      return;
    }
    setFocusCategories(agg.byCategory.slice(0, 5).map((c) => c.category));
    setRecentExamples(
      agg.byCategory
        .slice(0, 5)
        .flatMap((c) => c.recentExamples)
        .slice(0, 8)
    );
    setPhase("ready");
  }, []);

  const startDrills = useCallback(() => {
    resetStream();
    savedRef.current = false;
    submit("/api/grammar-drills", {
      focusCategories,
      count: 10,
      recentExamples,
    });
  }, [submit, resetStream, focusCategories, recentExamples]);

  useEffect(() => {
    if (result?.exercises?.length && phase !== "drilling") {
      setExercises(result.exercises);
      setAnswers(new Array(result.exercises.length).fill(""));
      setIndex(0);
      setSelected(null);
      setRevealed(false);
      setPhase("drilling");
    }
  }, [result, phase]);

  const current = exercises[index];
  const options = useMemo(() => {
    if (!current) return [];
    return shuffle(
      [current.correct, ...current.alternatives.slice(0, 3)],
      current.sentence
    );
  }, [current]);

  const handleReveal = useCallback(() => {
    if (!current || selected === null) return;
    setRevealed(true);
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = selected;
      return next;
    });
  }, [current, selected, index]);

  const handleNext = useCallback(() => {
    if (index + 1 >= exercises.length) {
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setRevealed(false);
  }, [index, exercises.length]);

  const score = useMemo(() => {
    return exercises.reduce(
      (acc, ex, i) => acc + (answers[i] === ex.correct ? 1 : 0),
      0
    );
  }, [exercises, answers]);

  // Save drill session once all answers are in
  useEffect(() => {
    if (phase !== "done" || savedRef.current || exercises.length === 0) return;
    savedRef.current = true;
    const session: DrillSession = {
      id: `d-${Date.now()}`,
      type: "drill",
      timestamp: Date.now(),
      focusCategories,
      exercises,
      answers,
      score,
    };
    saveSession(session);
  }, [phase, exercises, answers, score, focusCategories]);

  const restart = useCallback(() => {
    setExercises([]);
    setAnswers([]);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    resetStream();
    savedRef.current = false;
    setPhase("ready");
  }, [resetStream]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/grammar"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Grammar checker
            </Link>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Grammar drills
            </span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-amber-500/10 ring-1 ring-amber-400/20 text-xs font-medium text-amber-300">
              <Target className="w-3 h-3" />
              Targeted practice
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              <span className="font-display italic text-[1.1em] bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Fix
              </span>{" "}
              your recurring mistakes
            </h1>
            <p className="text-muted-foreground">
              AI-generated exercises tailored to the grammar patterns you&apos;ve struggled with.
            </p>
          </div>

          {phase === "loading-focus" && (
            <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          )}

          {phase === "no-history" && (
            <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No grammar history yet</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Drills are personalised from your past mistakes. Complete a
                  writing, speaking, or grammar-checker session first, then come
                  back for targeted practice.
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href="/grammar">
                    <Button variant="outline" size="sm">
                      Grammar checker
                    </Button>
                  </Link>
                  <Link href="/writing">
                    <Button variant="outline" size="sm">
                      Writing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {phase === "ready" && (
            <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-base">Today&apos;s focus</CardTitle>
                <CardDescription>
                  Based on your recent history — 10 exercises will be generated across these categories.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {focusCategories.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 ring-1 ring-amber-400/30 text-amber-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button onClick={startDrills} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Start drills
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="text-sm text-rose-300">
                    <p>{error}</p>
                    {rawText && (
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-48 mt-2">
                        {rawText}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {phase === "drilling" && current && (
            <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="text-xs tabular-nums">
                    {index + 1} / {exercises.length}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {current.rule}
                  </Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold leading-snug mt-3">
                  {current.sentence}
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  {current.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.map((opt) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === current.correct;
                    let style =
                      "bg-white/5 ring-white/10 hover:bg-white/10";
                    if (revealed) {
                      if (isCorrect) {
                        style =
                          "bg-emerald-500/15 ring-emerald-400/40 text-emerald-100";
                      } else if (isSelected) {
                        style =
                          "bg-rose-500/15 ring-rose-400/40 text-rose-100";
                      } else {
                        style = "bg-white/5 ring-white/10 opacity-60";
                      }
                    } else if (isSelected) {
                      style =
                        "bg-amber-500/15 ring-amber-400/40 text-amber-100";
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => !revealed && setSelected(opt)}
                        disabled={revealed}
                        className={`w-full text-left px-3 py-2 rounded-lg ring-1 transition-colors text-sm flex items-center justify-between gap-2 ${style}`}
                      >
                        <span>{opt}</span>
                        {revealed && isCorrect && (
                          <Check className="w-4 h-4 shrink-0" />
                        )}
                        {revealed && !isCorrect && isSelected && (
                          <X className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {revealed && (
                  <div
                    className={`rounded-lg p-3 ring-1 text-sm ${
                      selected === current.correct
                        ? "bg-emerald-500/10 ring-emerald-400/20 text-emerald-100"
                        : "bg-rose-500/5 ring-rose-400/20"
                    }`}
                  >
                    <p className="font-medium mb-1">
                      {selected === current.correct
                        ? "Correct"
                        : `Correct answer: "${current.correct}"`}
                    </p>
                    <p className="text-muted-foreground">
                      {current.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  {!revealed ? (
                    <Button onClick={handleReveal} disabled={!selected}>
                      Check answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      {index + 1 >= exercises.length ? (
                        <>
                          Finish
                          <Check className="w-4 h-4 ml-1.5" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {phase === "done" && (
            <div className="space-y-5">
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                <div
                  className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 blur-3xl pointer-events-none"
                  aria-hidden
                />
                <CardContent className="py-10 flex flex-col items-center gap-4 relative">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                    Session complete
                  </p>
                  <p className="text-5xl font-bold tabular-nums tracking-tight">
                    {score}
                    <span className="text-muted-foreground text-2xl">
                      {" "}
                      / {exercises.length}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {score === exercises.length
                      ? "Perfect — nice control."
                      : score >= exercises.length * 0.7
                      ? "Solid — a few patterns to refine."
                      : "Review the explanations below, then try again."}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                <CardHeader>
                  <CardTitle className="text-base">Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {exercises.map((ex, i) => {
                      const correct = answers[i] === ex.correct;
                      return (
                        <li
                          key={i}
                          className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3 text-sm"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span
                              className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                                correct
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              {correct ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </span>
                            <p className="font-medium">{ex.sentence}</p>
                          </div>
                          <p className="pl-7 text-xs">
                            {!correct && (
                              <>
                                <span className="text-rose-300">
                                  You: {answers[i] || "—"}
                                </span>
                                {" · "}
                              </>
                            )}
                            <span className="text-emerald-300">
                              Correct: {ex.correct}
                            </span>
                          </p>
                          <p className="pl-7 text-xs text-muted-foreground mt-1">
                            {ex.explanation}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={restart}>
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Drill again
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
