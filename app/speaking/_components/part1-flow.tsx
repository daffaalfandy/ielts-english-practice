"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getRandomPart1Topics,
  type SpeakingPart1TopicSet,
} from "@/lib/ielts-data";
import { useStream } from "@/lib/use-stream";
import { saveSession, type SpeakingPart1Feedback } from "@/lib/storage";
import { Loader2, RefreshCw } from "lucide-react";
import { QuestionFlow, type QuestionFlowSection } from "./question-flow";
import { Part1FeedbackDisplay } from "./feedback-display";

interface Part1FlowProps {
  onComplete?: (payload: {
    topics: SpeakingPart1TopicSet[];
    answers: string[];
  }) => void;
}

export function Part1Flow({ onComplete }: Part1FlowProps = {}) {
  const isOrchestrated = !!onComplete;
  const [topics, setTopics] = useState<SpeakingPart1TopicSet[] | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<string[]>([]);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!topics) setTopics(getRandomPart1Topics(3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    isLoading,
    error,
    rawText,
    result,
    submit,
    reset: resetStream,
  } = useStream<SpeakingPart1Feedback>();

  const sections: QuestionFlowSection[] = useMemo(
    () =>
      (topics ?? []).map((t) => ({
        label: t.topic,
        questions: t.questions,
      })),
    [topics]
  );

  const handleComplete = useCallback(
    (answers: string[]) => {
      if (!topics) return;
      setFinalAnswers(answers);
      setFinished(true);
      if (onComplete) {
        onComplete({ topics, answers });
        return;
      }
      submit("/api/speaking-part1-feedback", {
        topics: topics.map((t) => ({
          topic: t.topic,
          questions: t.questions,
        })),
        answers,
      });
    },
    [onComplete, submit, topics]
  );

  const restart = useCallback(() => {
    setTopics(getRandomPart1Topics(3));
    setFinished(false);
    setFinalAnswers([]);
    resetStream();
    savedRef.current = false;
  }, [resetStream]);

  useEffect(() => {
    if (isOrchestrated) return;
    if (!topics) return;
    if (result && !isLoading && !savedRef.current) {
      savedRef.current = true;
      saveSession({
        id: `s1-${Date.now()}`,
        type: "speaking",
        part: "part1",
        timestamp: Date.now(),
        topics: topics.map((t) => ({
          topic: t.topic,
          questions: t.questions,
        })),
        answers: finalAnswers,
        feedback: result,
      });
    }
  }, [result, isLoading, topics, finalAnswers, isOrchestrated]);

  if (!topics) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!finished) {
    return (
      <div className="space-y-5">
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Part 1 — {topics.length} topics selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 ring-1 ring-sky-400/30 text-sky-300"
                >
                  {t.topic}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
        <QuestionFlow
          sections={sections}
          softTimerSeconds={60}
          accentGradient="from-sky-400 to-indigo-500"
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
          <Loader2 className="w-7 h-7 animate-spin text-sky-400" />
          <p className="text-sm text-muted-foreground">
            Preparing next part...
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
            <Loader2 className="w-7 h-7 animate-spin text-sky-400" />
            <p className="text-sm text-muted-foreground">
              AI examiner is scoring your Part 1 answers...
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
              onClick={() => {
                if (!topics) return;
                submit("/api/speaking-part1-feedback", {
                  topics: topics.map((t) => ({
                    topic: t.topic,
                    questions: t.questions,
                  })),
                  answers: finalAnswers,
                });
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
      {result && !isLoading && (
        <>
          <Part1FeedbackDisplay result={result} />
          <div className="flex justify-end">
            <Button variant="outline" onClick={restart}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Try again with new topics
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
