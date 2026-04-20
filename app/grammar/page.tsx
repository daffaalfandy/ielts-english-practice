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
import { Separator } from "@/components/ui/separator";
import { useStream } from "@/lib/use-stream";
import { saveSession, type GrammarFeedback } from "@/lib/storage";
import {
  CheckSquare,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function GrammarPage() {
  const [text, setText] = useState("");
  const { isLoading, error, rawText, result, submit, reset } =
    useStream<GrammarFeedback>();
  const savedRef = useRef(false);

  const handleSubmit = useCallback(async () => {
    savedRef.current = false;
    await submit("/api/grammar-check", { text });
  }, [submit, text]);

  // Save session when result is ready
  useEffect(() => {
    if (result && !isLoading && !savedRef.current) {
      savedRef.current = true;
      saveSession({
        id: `g-${Date.now()}`,
        type: "grammar",
        timestamp: Date.now(),
        input: text,
        feedback: result,
      });
    }
  }, [result, isLoading, text]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-sky-500/10 ring-1 ring-sky-400/20 text-xs font-medium text-sky-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Grammar
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Grammar
              </span>{" "}
              Checker
            </h1>
            <p className="text-muted-foreground">
              Paste any English text and get detailed grammar corrections.
            </p>
          </div>

          {/* Input */}
          <Card className="mb-6 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="w-4.5 h-4.5 text-sky-400" />
                Your Text
              </CardTitle>
              <CardDescription>
                Paste an email, essay, paragraph, or any English text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your English text here for grammar checking..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[180px] text-sm leading-relaxed"
                disabled={isLoading}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || text.trim().length < 10}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Check Grammar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isLoading && (
            <Card className="mb-6 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-10 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your text for grammar errors...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error */}
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

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6">
              {/* Overall Comment */}
              <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {result.overall_comment}
                  </p>
                  {result.common_error_patterns &&
                    result.common_error_patterns.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {result.common_error_patterns.map((pattern, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Corrected Text */}
              <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                    Corrected Text
                  </CardTitle>
                  <CardDescription>
                    Your text with all grammar corrections applied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-500/10 p-4 rounded-xl ring-1 ring-emerald-400/20">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {result.corrected_text}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Errors List */}
              {result.errors && result.errors.length > 0 && (
                <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                      Grammar Errors Found ({result.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.errors.map((err, i) => (
                        <div key={i}>
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-bold bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                              {i + 1}
                            </span>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm text-rose-300/90 line-through">
                                  {err.original}
                                </span>
                                <span className="text-muted-foreground">
                                  &rarr;
                                </span>
                                <span className="text-sm text-emerald-300 font-medium">
                                  {err.correction}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {err.rule}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-xs mt-1"
                              >
                                {err.category}
                              </Badge>
                            </div>
                          </div>
                          {i < result.errors.length - 1 && (
                            <Separator className="mt-4 bg-white/5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.errors && result.errors.length === 0 && (
                <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
                  <CardContent className="py-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium">
                      No grammar errors found!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your text looks grammatically correct.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
