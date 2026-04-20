"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
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
import { WordCounter } from "@/components/WordCounter";
import { Task1Chart } from "@/components/Task1Chart";
import { BandScore, OverallBand } from "@/components/BandScore";
import {
  StrengthsList,
  ImprovementsList,
  VocabSuggestions,
} from "@/components/FeedbackCard";
import { useStream } from "@/lib/use-stream";
import { writingPrompts, type WritingPrompt } from "@/lib/ielts-data";
import { saveSession, type WritingFeedback } from "@/lib/storage";
import { RefreshCw, Send, Loader2 } from "lucide-react";

export default function WritingPage() {
  const [selectedTask, setSelectedTask] = useState<1 | 2>(2);
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt>(
    writingPrompts.filter((p) => p.task === 2)[0]
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      const filtered = writingPrompts.filter((p) => p.task === 2);
      setCurrentPrompt(filtered[Math.floor(Math.random() * filtered.length)]);
      setMounted(true);
    }
  }, [mounted]);
  const [text, setText] = useState("");
  const { isLoading, error, rawText, result, submit, reset } =
    useStream<WritingFeedback>();
  const savedRef = useRef(false);

  const switchTask = useCallback(
    (task: 1 | 2) => {
      setSelectedTask(task);
      const filtered = writingPrompts.filter((p) => p.task === task);
      setCurrentPrompt(
        filtered[Math.floor(Math.random() * filtered.length)]
      );
      setText("");
      reset();
    },
    [reset]
  );

  const newPrompt = useCallback(() => {
    const filtered = writingPrompts.filter(
      (p) => p.task === selectedTask
    );
    const next =
      filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentPrompt(next);
    setText("");
    reset();
  }, [selectedTask, reset]);

  const handleSubmit = useCallback(async () => {
    savedRef.current = false;
    await submit("/api/writing-feedback", {
      prompt: currentPrompt.prompt,
      response: text,
      task: currentPrompt.task,
      visualData: currentPrompt.visualData,
    });
  }, [submit, currentPrompt, text]);

  // Save to localStorage when result is available
  useEffect(() => {
    if (result && !isLoading && !savedRef.current) {
      savedRef.current = true;
      saveSession({
        id: `w-${Date.now()}`,
        type: "writing",
        timestamp: Date.now(),
        task: currentPrompt.task,
        prompt: currentPrompt.prompt,
        response: text,
        feedback: result,
      });
    }
  }, [result, isLoading, currentPrompt, text]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-violet-500/10 ring-1 ring-violet-400/20 text-xs font-medium text-violet-300">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Writing
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              <span className="font-display italic text-[1.1em] bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Writing
              </span>{" "}
              Practice
            </h1>
            <p className="text-muted-foreground">
              Practice your IELTS writing skills and get instant AI feedback.
            </p>
          </div>

          {/* Task Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={selectedTask === 1 ? "default" : "outline"}
              onClick={() => switchTask(1)}
              disabled={isLoading}
            >
              Task 1 (150+ words)
            </Button>
            <Button
              variant={selectedTask === 2 ? "default" : "outline"}
              onClick={() => switchTask(2)}
              disabled={isLoading}
            >
              Task 2 (250+ words)
            </Button>
          </div>

          {/* Prompt Card */}
          <Card className="mb-6 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Writing Prompt</CardTitle>
                  <Badge variant="secondary">
                    Task {currentPrompt.task}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={newPrompt}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  New Prompt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {currentPrompt.prompt}
              </p>
            </CardContent>
          </Card>

          {currentPrompt.task === 1 && currentPrompt.visualData && (
            <div className="mb-6">
              <Task1Chart data={currentPrompt.visualData} />
            </div>
          )}

          {/* Writing Area */}
          <Card className="mb-6 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Response</CardTitle>
                <WordCounter
                  text={text}
                  minWords={currentPrompt.minWords}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your response here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[250px] text-sm leading-relaxed"
                disabled={isLoading}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isLoading || text.trim().split(/\s+/).length < 20
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get Feedback
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="mb-6 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    AI examiner is reviewing your writing...
                  </p>
                  {rawText && (
                    <pre className="text-xs text-muted-foreground max-w-full overflow-auto mt-2">
                      {rawText.slice(0, 200)}...
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-6 bg-rose-500/5 backdrop-blur-xl ring-1 ring-rose-400/30">
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
                  onClick={handleSubmit}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback Results */}
          {result && !isLoading && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                <CardContent className="py-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <OverallBand score={result.overall_band} />
                    <div className="flex-1 w-full space-y-3">
                      <BandScore
                        score={result.scores.task_achievement}
                        label="Task Achievement"
                        size="lg"
                      />
                      <BandScore
                        score={result.scores.coherence_cohesion}
                        label="Coherence & Cohesion"
                        size="lg"
                      />
                      <BandScore
                        score={result.scores.lexical_resource}
                        label="Lexical Resource"
                        size="lg"
                      />
                      <BandScore
                        score={result.scores.grammar}
                        label="Grammar"
                        size="lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StrengthsList items={result.strengths} />
                <ImprovementsList items={result.improvements} />
              </div>

              {/* Band 7 Model Answer */}
              {result.band7_model_answer && (
                <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                            Band 7
                          </span>
                          Complete Model Answer
                        </CardTitle>
                        <CardDescription className="mt-1">
                          A full independent response written to score Band 7. Study the structure, vocabulary, and cohesive devices.
                        </CardDescription>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            result.band7_model_answer
                          )
                        }
                        className="shrink-0 text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm leading-relaxed bg-emerald-500/5 p-4 rounded-xl ring-1 ring-emerald-400/20 whitespace-pre-wrap">
                      {result.band7_model_answer}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vocabulary Suggestions */}
              {result.vocabulary_suggestions &&
                result.vocabulary_suggestions.length > 0 && (
                  <VocabSuggestions items={result.vocabulary_suggestions} />
                )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
