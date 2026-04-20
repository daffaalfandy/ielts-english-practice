"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStream } from "@/lib/use-stream";
import {
  saveSession,
  type SpeakingFullFeedback,
} from "@/lib/storage";
import type {
  SpeakingCueCard,
  SpeakingPart1TopicSet,
  SpeakingTheme,
} from "@/lib/ielts-data";
import { Loader2, Trophy, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { Part1Flow } from "./part1-flow";
import { Part2Flow } from "./part2-flow";
import { Part3Flow } from "./part3-flow";
import { FullTestFeedbackDisplay } from "./feedback-display";

type Phase =
  | "intro"
  | "part1"
  | "breather1"
  | "part2"
  | "breather2"
  | "part3"
  | "submitting"
  | "results"
  | "error";

interface Collected {
  part1: {
    topics: SpeakingPart1TopicSet[];
    answers: string[];
  } | null;
  part2: {
    cueCard: SpeakingCueCard;
    transcript: string;
  } | null;
  part3: {
    theme: SpeakingTheme;
    questions: string[];
    answers: string[];
    pairedCueCard?: SpeakingCueCard;
  } | null;
}

const BREATHER_SECONDS = 10;

export function FullTestFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const collected = useRef<Collected>({
    part1: null,
    part2: null,
    part3: null,
  });
  const [, forceRerender] = useState(0);
  const [breatherLeft, setBreatherLeft] = useState(BREATHER_SECONDS);
  const savedRef = useRef(false);
  const {
    isLoading,
    error,
    rawText,
    result,
    submit,
    reset: resetStream,
  } = useStream<SpeakingFullFeedback>();

  // Breather countdown
  useEffect(() => {
    if (phase !== "breather1" && phase !== "breather2") return;
    setBreatherLeft(BREATHER_SECONDS);
    const iv = setInterval(() => {
      setBreatherLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          // Advance to the next phase after the final tick
          setTimeout(() => {
            setPhase((current) =>
              current === "breather1"
                ? "part2"
                : current === "breather2"
                  ? "part3"
                  : current
            );
          }, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const onPart1Done = useCallback(
    (p: { topics: SpeakingPart1TopicSet[]; answers: string[] }) => {
      collected.current.part1 = p;
      // 200ms tick to let mic release cleanly before Part 2 auto-starts
      setTimeout(() => setPhase("breather1"), 200);
    },
    []
  );

  const onPart2Done = useCallback(
    (p: { cueCard: SpeakingCueCard; transcript: string }) => {
      collected.current.part2 = p;
      setTimeout(() => setPhase("breather2"), 200);
    },
    []
  );

  const onPart3Done = useCallback(
    (p: {
      theme: SpeakingTheme;
      questions: string[];
      answers: string[];
      pairedCueCard?: SpeakingCueCard;
    }) => {
      collected.current.part3 = p;
      setPhase("submitting");
    },
    []
  );

  // Fire the consolidated API call once we enter submitting phase
  useEffect(() => {
    if (phase !== "submitting") return;
    const { part1, part2, part3 } = collected.current;
    if (!part1 || !part2 || !part3) {
      setPhase("error");
      return;
    }
    submit("/api/speaking-full-feedback", {
      part1: {
        topics: part1.topics.map((t) => ({
          topic: t.topic,
          questions: t.questions,
        })),
        answers: part1.answers,
      },
      part2: {
        cueCard: `${part2.cueCard.topic} ${part2.cueCard.bulletPoints.join(", ")}`,
        transcript: part2.transcript,
      },
      part3: {
        theme: part3.theme,
        questions: part3.questions,
        answers: part3.answers,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Transition submitting → results / error
  useEffect(() => {
    if (phase !== "submitting") return;
    if (result && !isLoading) setPhase("results");
    else if (error && !isLoading) setPhase("error");
  }, [result, error, isLoading, phase]);

  // Save the full session on success
  useEffect(() => {
    if (phase !== "results") return;
    if (savedRef.current || !result) return;
    const { part1, part2, part3 } = collected.current;
    if (!part1 || !part2 || !part3) return;
    savedRef.current = true;
    saveSession({
      id: `sf-${Date.now()}`,
      type: "speaking",
      part: "full",
      timestamp: Date.now(),
      part1: {
        topics: part1.topics.map((t) => ({
          topic: t.topic,
          questions: t.questions,
        })),
        answers: part1.answers,
      },
      part2: {
        cueCard: part2.cueCard.topic,
        transcript: part2.transcript,
      },
      part3: {
        theme: part3.theme,
        questions: part3.questions,
        answers: part3.answers,
      },
      feedback: result,
    });
  }, [phase, result]);

  const restart = useCallback(() => {
    collected.current = { part1: null, part2: null, part3: null };
    resetStream();
    savedRef.current = false;
    setPhase("intro");
    forceRerender((n) => n + 1);
  }, [resetStream]);

  // ---- Render ----
  if (phase === "intro") {
    return (
      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <div
          className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 blur-3xl pointer-events-none"
          aria-hidden
        />
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-white/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-300">
                Full Test
              </p>
              <CardTitle className="text-xl">
                All three parts, scored holistically
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-sky-300 font-mono text-xs">01</span>
              <span>
                <strong>Part 1</strong> — 3 random topics, short personal
                questions (~5 min)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-emerald-300 font-mono text-xs">
                02
              </span>
              <span>
                <strong>Part 2</strong> — cue card with 1 min prep + 2 min talk
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-violet-300 font-mono text-xs">
                03
              </span>
              <span>
                <strong>Part 3</strong> — abstract discussion linked to your
                Part 2 theme (~5 min)
              </span>
            </li>
          </ol>
          <p className="text-xs text-muted-foreground">
            Feedback arrives once at the end with per-part band scores and an
            overall estimate.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setPhase("part1")}>
              Start full test
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (phase === "part1") return <Part1Flow onComplete={onPart1Done} />;

  if (phase === "part2") {
    const lockedTheme =
      collected.current.part2?.cueCard.theme ?? undefined;
    return (
      <Part2Flow
        onComplete={onPart2Done}
        lockedTheme={lockedTheme}
        hideNewCard
      />
    );
  }

  if (phase === "part3") {
    const pairedCueCard = collected.current.part2?.cueCard;
    const theme = pairedCueCard?.theme;
    return (
      <Part3Flow
        theme={theme}
        pairedCueCard={pairedCueCard}
        onComplete={onPart3Done}
      />
    );
  }

  if (phase === "breather1" || phase === "breather2") {
    const nextLabel =
      phase === "breather1" ? "Part 2 — Cue Card" : "Part 3 — Discussion";
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>
          <p className="text-sm font-medium">
            {phase === "breather1" ? "Part 1 complete" : "Part 2 complete"}
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Take a breath. {nextLabel} starts automatically in{" "}
            <span className="text-foreground font-semibold tabular-nums">
              {breatherLeft}s
            </span>
            .
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPhase(phase === "breather1" ? "part2" : "part3")
            }
          >
            Continue now
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "submitting") {
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-12 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm font-medium">
            Compiling your full-test feedback...
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            The AI examiner is reviewing all three parts and producing a
            holistic band estimate.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "results" && result) {
    return (
      <div className="space-y-5">
        <FullTestFeedbackDisplay result={result} />
        <div className="flex justify-end">
          <Button variant="outline" onClick={restart}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Take another full test
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <Card className="bg-rose-500/5 backdrop-blur-xl ring-1 ring-rose-400/30">
        <CardContent className="py-6 space-y-3">
          <p className="text-sm text-rose-300">
            {error ?? "Full-test feedback failed."}
          </p>
          {rawText && (
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
              {rawText}
            </pre>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhase("submitting")}
            >
              Retry scoring
            </Button>
            <Button variant="outline" size="sm" onClick={restart}>
              Start over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
