"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getPart3QuestionsForTheme,
  getRandomCueCard,
  getRandomCueCardByTheme,
  type SpeakingCueCard,
  type SpeakingTheme,
} from "@/lib/ielts-data";
import { useStream } from "@/lib/use-stream";
import { saveSession, type SpeakingPart3Feedback } from "@/lib/storage";
import { Loader2, RefreshCw } from "lucide-react";
import { QuestionFlow, type QuestionFlowSection } from "./question-flow";
import { SPEAKING_PART3_PER_QUESTION_SECONDS } from "@/lib/timing";
import { Part3FeedbackDisplay } from "./feedback-display";

interface Part3FlowProps {
  /** If set, questions are drawn for this theme rather than random. */
  theme?: SpeakingTheme;
  /** Optional cue card context to display (passed by FullTest). */
  pairedCueCard?: SpeakingCueCard;
  onComplete?: (payload: {
    theme: SpeakingTheme;
    questions: string[];
    answers: string[];
    pairedCueCard?: SpeakingCueCard;
  }) => void;
}

const themeColors: Record<SpeakingTheme, string> = {
  place: "sky",
  person: "violet",
  object: "indigo",
  event: "fuchsia",
  experience: "rose",
  skill: "emerald",
  activity: "teal",
  media: "amber",
  food: "orange",
  goal: "lime",
};

export function Part3Flow({
  theme: themeProp,
  pairedCueCard: pairedProp,
  onComplete,
}: Part3FlowProps = {}) {
  const isOrchestrated = !!onComplete;
  const [pairedCard, setPairedCard] = useState<SpeakingCueCard | null>(
    pairedProp ?? null
  );

  useEffect(() => {
    if (pairedCard) return;
    setPairedCard(
      themeProp ? getRandomCueCardByTheme(themeProp) : getRandomCueCard()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme: SpeakingTheme | null =
    themeProp ?? pairedCard?.theme ?? null;
  const questions = useMemo(
    () => (theme ? getPart3QuestionsForTheme(theme) : []),
    [theme]
  );
  const [finished, setFinished] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<string[]>([]);
  const savedRef = useRef(false);
  const {
    isLoading,
    error,
    rawText,
    result,
    submit,
    reset: resetStream,
  } = useStream<SpeakingPart3Feedback>();

  const sections: QuestionFlowSection[] = useMemo(
    () => [{ label: `Theme: ${theme}`, questions }],
    [theme, questions]
  );

  const handleComplete = useCallback(
    (answers: string[]) => {
      if (!theme || !pairedCard) return;
      setFinalAnswers(answers);
      setFinished(true);
      if (onComplete) {
        onComplete({
          theme,
          questions,
          answers,
          pairedCueCard: pairedCard,
        });
        return;
      }
      submit("/api/speaking-part3-feedback", {
        theme,
        questions,
        answers,
        pairedCueCard: pairedCard.topic,
      });
    },
    [onComplete, submit, theme, questions, pairedCard]
  );

  const restart = useCallback(() => {
    setFinished(false);
    setFinalAnswers([]);
    resetStream();
    savedRef.current = false;
  }, [resetStream]);

  useEffect(() => {
    if (isOrchestrated) return;
    if (!theme || !pairedCard) return;
    if (result && !isLoading && !savedRef.current) {
      savedRef.current = true;
      saveSession({
        id: `s3-${Date.now()}`,
        type: "speaking",
        part: "part3",
        timestamp: Date.now(),
        theme,
        pairedCueCard: pairedCard.topic,
        questions,
        answers: finalAnswers,
        feedback: result,
      });
    }
  }, [
    result,
    isLoading,
    theme,
    pairedCard,
    questions,
    finalAnswers,
    isOrchestrated,
  ]);

  if (!pairedCard || !theme) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const color = themeColors[theme];

  if (!finished) {
    return (
      <div className="space-y-5">
        <Card
          className={`bg-card/60 backdrop-blur-xl ring-1 ring-white/10`}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">Part 3 Discussion</CardTitle>
              <Badge
                variant="outline"
                className={`bg-${color}-500/10 border-${color}-400/30 text-${color}-300 uppercase text-[11px] tracking-wide`}
              >
                {theme}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              Abstract follow-up to a Part 2 theme. Expect to extend your
              answers with examples and reasoning.
            </CardDescription>
          </CardHeader>
          {pairedCard && !pairedProp && (
            <CardContent>
              <p className="text-xs text-muted-foreground mb-1">
                Linked to the cue card:
              </p>
              <p className="text-sm italic">&ldquo;{pairedCard.topic}&rdquo;</p>
            </CardContent>
          )}
        </Card>
        <QuestionFlow
          sections={sections}
          softTimerSeconds={SPEAKING_PART3_PER_QUESTION_SECONDS}
          accentGradient="from-violet-400 to-fuchsia-500"
          onComplete={handleComplete}
          disabled={isLoading}
        />
      </div>
    );
  }

  if (isOrchestrated) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-10 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
          <p className="text-sm text-muted-foreground">
            Compiling full-test feedback...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {isLoading && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardContent className="py-10 flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
            <p className="text-sm text-muted-foreground">
              AI examiner is scoring your Part 3 answers...
            </p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="bg-rose-500/5 backdrop-blur-xl ring-1 ring-rose-400/30">
          <CardContent className="py-6">
            <p className="text-sm text-rose-300 mb-2">{error}</p>
            {rawText && (
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
                {rawText}
              </pre>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                submit("/api/speaking-part3-feedback", {
                  theme,
                  questions,
                  answers: finalAnswers,
                  pairedCueCard: pairedCard.topic,
                })
              }
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
      {result && !isLoading && (
        <>
          <Part3FeedbackDisplay result={result} />
          <div className="flex justify-end">
            <Button variant="outline" onClick={restart}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Try again
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
