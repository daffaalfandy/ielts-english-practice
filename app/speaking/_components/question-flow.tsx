"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSpeechRecognition } from "@/lib/use-speech-recognition";
import {
  Mic,
  MicOff,
  ArrowRight,
  Check,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

export interface QuestionFlowSection {
  label?: string; // topic label, e.g., "Hometown"
  questions: string[];
}

interface QuestionFlowProps {
  /** Pre-flattened sections — each renders a divider when the label changes. */
  sections: QuestionFlowSection[];
  /** Soft countdown per question (seconds). Advances nothing — purely visual. */
  softTimerSeconds: number;
  /** Accent gradient for the header chip. */
  accentGradient: string; // e.g. "from-sky-400 to-indigo-500"
  /** Called once the user finishes the last question. */
  onComplete: (answers: string[]) => void;
  /** Optional disabled state (e.g., while orchestrator is submitting). */
  disabled?: boolean;
}

interface FlatEntry {
  question: string;
  sectionLabel?: string;
  isSectionStart: boolean;
}

export function QuestionFlow({
  sections,
  softTimerSeconds,
  accentGradient,
  onComplete,
  disabled,
}: QuestionFlowProps) {
  const flat: FlatEntry[] = useMemo(() => {
    const out: FlatEntry[] = [];
    sections.forEach((s) => {
      s.questions.forEach((q, i) => {
        out.push({
          question: q,
          sectionLabel: s.label,
          isSectionStart: i === 0,
        });
      });
    });
    return out;
  }, [sections]);

  const total = flat.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(total).fill("")
  );
  const [editingDraft, setEditingDraft] = useState("");
  const [timeLeft, setTimeLeft] = useState(softTimerSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const {
    isSupported,
    isListening,
    finalTranscript,
    interimTranscript,
    error: speechError,
    start: startListening,
    stop: stopListening,
    reset: resetSpeech,
    setFinalTranscript,
  } = useSpeechRecognition({
    lang: "en-US",
    continuous: true,
    interimResults: true,
  });

  // Auto-start mic on mount
  useEffect(() => {
    if (isSupported) startListening();
    return () => resetSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  // Reset the soft timer when the question changes
  useEffect(() => {
    setTimeLeft(softTimerSeconds);
  }, [index, softTimerSeconds]);

  // Soft countdown (does not auto-advance)
  useEffect(() => {
    if (disabled) return;
    const iv = setInterval(() => {
      setTimeLeft((t) => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(iv);
  }, [disabled]);

  // Mirror the live mic transcript into the draft unless the user is editing
  useEffect(() => {
    setEditingDraft(finalTranscript);
  }, [finalTranscript]);

  const handleDraftChange = useCallback(
    (value: string) => {
      setEditingDraft(value);
      setFinalTranscript(value);
    },
    [setFinalTranscript]
  );

  const advance = useCallback(() => {
    const trimmed = editingDraft.trim();
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = trimmed;
      return next;
    });
    setFinalTranscript("");
    setEditingDraft("");

    if (index + 1 >= total) {
      setIsFinished(true);
      return;
    }
    setIndex(index + 1);
  }, [index, editingDraft, total, setFinalTranscript]);

  // Fire onComplete after the final answers state has committed
  useEffect(() => {
    if (!isFinished || completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current(answers);
  }, [isFinished, answers]);

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const currentEntry = flat[index];
  const mm = Math.floor(Math.max(timeLeft, 0) / 60);
  const ss = Math.max(timeLeft, 0) % 60;
  const progressPct = ((index + 1) / total) * 100;

  if (!currentEntry) return null;

  return (
    <div className="space-y-5">
      {/* Progress + unsupported-browser notice */}
      {!isSupported && (
        <Card className="bg-amber-500/5 backdrop-blur-xl ring-1 ring-amber-400/30">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-300">
                Speech recognition not available in this browser
              </p>
              <p className="text-muted-foreground mt-1">
                Use Chrome or Edge over HTTPS/localhost. Type your answers
                manually for now.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {speechError && (
        <Card className="bg-rose-500/5 backdrop-blur-xl ring-1 ring-rose-400/30">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <p className="text-sm text-rose-300">{speechError}</p>
          </CardContent>
        </Card>
      )}

      {/* Question card */}
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${accentGradient} transition-all duration-500`}
          style={{ width: `${progressPct}%`, position: "relative" }}
          aria-hidden
        />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs tabular-nums">
                Q {index + 1} / {total}
              </Badge>
              {currentEntry.sectionLabel && (
                <Badge
                  variant="secondary"
                  className="text-xs uppercase tracking-wide"
                >
                  {currentEntry.sectionLabel}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono tabular-nums">
                {mm}:{ss.toString().padStart(2, "0")}
              </span>
              {isSupported && isListening && (
                <Badge
                  variant="outline"
                  className="border-rose-400/40 text-rose-300 bg-rose-500/10 gap-1.5"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
                  </span>
                  REC
                </Badge>
              )}
              {isSupported && !isListening && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <MicOff className="w-3 h-3" /> Paused
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg sm:text-xl font-semibold leading-snug mt-3">
            {currentEntry.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={
                isSupported
                  ? "Start speaking — your words will appear here. You can edit before advancing."
                  : "Type your answer here..."
              }
              value={editingDraft}
              onChange={(e) => handleDraftChange(e.target.value)}
              className="min-h-[120px] text-sm leading-relaxed"
              disabled={disabled}
            />
            {isListening && interimTranscript && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                <span className="text-emerald-300/70">…</span>{" "}
                {interimTranscript}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {isSupported ? (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMic}
                disabled={disabled}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-1.5" />
                    Pause mic
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-1.5" />
                    Resume mic
                  </>
                )}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Type your answer
              </span>
            )}
            <Button
              onClick={advance}
              disabled={disabled || editingDraft.trim().length < 2}
              className="ml-auto"
            >
              {index + 1 >= total ? (
                <>
                  Finish
                  <Check className="w-4 h-4 ml-1.5" />
                </>
              ) : (
                <>
                  Next question
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answered preview */}
      {answers.some((a) => a.length > 0) && (
        <Card className="bg-card/40 backdrop-blur-xl ring-1 ring-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Answered so far
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              {answers.slice(0, index).map((a, i) => (
                <li key={i} className="text-muted-foreground">
                  <span className="text-foreground/80">{flat[i].question}</span>
                  <p className="pl-4 mt-0.5 text-muted-foreground italic text-xs">
                    {a || "(no answer)"}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
