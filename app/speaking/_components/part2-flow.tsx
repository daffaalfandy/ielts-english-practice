"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/Timer";
import { useStream } from "@/lib/use-stream";
import { useSpeechRecognition } from "@/lib/use-speech-recognition";
import {
  getRandomCueCard,
  getRandomCueCardByTheme,
  type SpeakingCueCard,
  type SpeakingTheme,
} from "@/lib/ielts-data";
import { saveSession, type SpeakingFeedback } from "@/lib/storage";
import {
  RefreshCw,
  Loader2,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  AlertTriangle,
} from "lucide-react";
import { Part2FeedbackDisplay } from "./feedback-display";

type Phase = "idle" | "prep" | "speaking" | "done";

interface Part2FlowProps {
  /** When provided, skip own feedback + persistence and defer to caller. */
  onComplete?: (payload: { cueCard: SpeakingCueCard; transcript: string }) => void;
  /** Force a specific theme (used by FullTestFlow). */
  lockedTheme?: SpeakingTheme;
  /** Hide the "new card" button (used by FullTestFlow). */
  hideNewCard?: boolean;
}

export function Part2Flow({
  onComplete,
  lockedTheme,
  hideNewCard,
}: Part2FlowProps = {}) {
  const isOrchestrated = !!onComplete;
  const [cueCard, setCueCard] = useState<SpeakingCueCard | null>(null);
  useEffect(() => {
    if (cueCard) return;
    setCueCard(
      lockedTheme ? getRandomCueCardByTheme(lockedTheme) : getRandomCueCard()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [userEdited, setUserEdited] = useState(false);
  const { isLoading, error, rawText, result, submit, reset } =
    useStream<SpeakingFeedback>();
  const savedRef = useRef(false);

  const {
    isSupported: speechSupported,
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

  useEffect(() => {
    if (!userEdited) setTranscript(finalTranscript);
  }, [finalTranscript, userEdited]);

  const startPrep = useCallback(() => {
    setPhase("prep");
    setTranscript("");
    setUserEdited(false);
    resetSpeech();
    reset();
    savedRef.current = false;
  }, [reset, resetSpeech]);

  const startSpeaking = useCallback(() => {
    setPhase("speaking");
    if (speechSupported) startListening();
  }, [speechSupported, startListening]);

  const submitFeedback = useCallback(async () => {
    if (!cueCard) return;
    stopListening();
    setPhase("done");

    const effectiveTranscript = (
      userEdited ? transcript : finalTranscript
    ).trim();
    if (effectiveTranscript.length < 10) return;

    if (onComplete) {
      onComplete({ cueCard, transcript: effectiveTranscript });
      return;
    }

    const cueText = `${cueCard.topic} ${cueCard.bulletPoints.join(", ")}`;
    await submit("/api/speaking-feedback", {
      cueCard: cueText,
      transcript: effectiveTranscript,
    });
  }, [
    transcript,
    finalTranscript,
    userEdited,
    cueCard,
    submit,
    stopListening,
    onComplete,
  ]);

  const newCueCard = useCallback(() => {
    setCueCard(
      lockedTheme ? getRandomCueCardByTheme(lockedTheme) : getRandomCueCard()
    );
    setPhase("idle");
    setTranscript("");
    setUserEdited(false);
    resetSpeech();
    reset();
    savedRef.current = false;
  }, [reset, resetSpeech, lockedTheme]);

  const handleTranscriptChange = useCallback(
    (value: string) => {
      setTranscript(value);
      setUserEdited(true);
      setFinalTranscript(value);
    },
    [setFinalTranscript]
  );

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Save session on feedback arrival (standalone mode only)
  useEffect(() => {
    if (isOrchestrated) return;
    if (!cueCard) return;
    if (result && !isLoading && !savedRef.current) {
      savedRef.current = true;
      saveSession({
        id: `s-${Date.now()}`,
        type: "speaking",
        part: "part2",
        timestamp: Date.now(),
        cueCard: cueCard.topic,
        transcript,
        feedback: result,
      });
    }
  }, [result, isLoading, cueCard, transcript, isOrchestrated]);

  if (!cueCard) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cue Card */}
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Part 2 Cue Card</CardTitle>
              <Badge variant="secondary">IELTS Speaking</Badge>
            </div>
            {!hideNewCard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={newCueCard}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                New Card
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-3">{cueCard.topic}</p>
          <p className="text-sm text-muted-foreground mb-2">You should say:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {cueCard.bulletPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&bull;</span>
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {phase !== "idle" && !speechSupported && (
        <Card className="bg-amber-500/5 backdrop-blur-xl ring-1 ring-amber-400/30">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-300">
                Speech recognition not available in this browser
              </p>
              <p className="text-muted-foreground mt-1">
                Use Chrome/Edge (HTTPS or localhost), or type your transcript
                below.
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

      {phase === "idle" && (
        <div className="flex justify-center">
          <Button size="lg" onClick={startPrep}>
            Start Practice
          </Button>
        </div>
      )}

      {phase === "prep" && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardContent className="py-10 flex flex-col items-center">
            <Timer
              duration={60}
              isRunning={true}
              onComplete={startSpeaking}
              label="Preparation Time"
              color="yellow"
            />
            <p className="text-sm text-muted-foreground mt-4">
              Make notes and plan your answer.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={startSpeaking}
            >
              Skip — Start Speaking Now
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "speaking" && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardContent className="py-10 flex flex-col items-center gap-4">
            <Timer
              duration={120}
              isRunning={true}
              onComplete={submitFeedback}
              label="Speaking Time"
              color="green"
            />
            {speechSupported && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleMic}
                  className={
                    isListening
                      ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30"
                      : ""
                  }
                >
                  {isListening ? (
                    <>
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      Listening — tap to pause
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Resume listening
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your speech is transcribed live below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(phase === "speaking" || phase === "done") && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Transcript
                </CardTitle>
                <CardDescription className="mt-1">
                  {speechSupported
                    ? "Live transcription appears here — you can edit before submitting."
                    : "Type your transcript here."}
                </CardDescription>
              </div>
              {speechSupported && isListening && (
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
              {speechSupported && !isListening && phase === "speaking" && (
                <Badge variant="outline" className="gap-1.5">
                  <MicOff className="w-3 h-3" /> Paused
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder={
                  speechSupported
                    ? "Start speaking — your words will appear here..."
                    : "Type your spoken response here..."
                }
                value={transcript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                className="min-h-[150px] text-sm leading-relaxed"
                disabled={isLoading || (phase === "done" && !!result)}
              />
              {isListening && interimTranscript && (
                <p className="mt-2 text-sm text-muted-foreground italic">
                  <span className="text-emerald-300/70">…</span>{" "}
                  {interimTranscript}
                </p>
              )}
            </div>
            {phase === "speaking" && (
              <div className="flex justify-end mt-4">
                <Button
                  onClick={submitFeedback}
                  disabled={transcript.trim().length < 10}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isOrchestrated ? "Continue" : "Get Feedback"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isOrchestrated && isLoading && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardContent className="py-10 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              AI examiner is evaluating your speaking...
            </p>
          </CardContent>
        </Card>
      )}

      {!isOrchestrated && error && (
        <Card className="bg-rose-500/5 backdrop-blur-xl ring-1 ring-rose-400/30">
          <CardContent className="py-6">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            {rawText && (
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
                {rawText}
              </pre>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={submitFeedback}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isOrchestrated && result && !isLoading && (
        <Part2FeedbackDisplay result={result} />
      )}
    </div>
  );
}
