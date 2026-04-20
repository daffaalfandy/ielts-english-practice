"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BandScore, OverallBand } from "@/components/BandScore";
import {
  FeedbackCard,
  GrammarErrorsList,
  UsefulPhrases,
} from "@/components/FeedbackCard";
import type {
  SpeakingFeedback,
  SpeakingPart1Feedback,
  SpeakingPart3Feedback,
  SpeakingFullFeedback,
} from "@/lib/storage";
import { Target, Lightbulb, Copy } from "lucide-react";

type AccentColor = "sky" | "violet" | "emerald" | "amber";

const accentMap: Record<AccentColor, { bg: string; ring: string; text: string }> = {
  sky: {
    bg: "bg-sky-500/5",
    ring: "ring-sky-400/20",
    text: "text-sky-300",
  },
  violet: {
    bg: "bg-violet-500/5",
    ring: "ring-violet-400/20",
    text: "text-violet-300",
  },
  emerald: {
    bg: "bg-emerald-500/5",
    ring: "ring-emerald-400/20",
    text: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-500/5",
    ring: "ring-amber-400/20",
    text: "text-amber-300",
  },
};

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Copy className="w-3 h-3" />
      Copy
    </button>
  );
}

function ModelAnswerCard({
  answer,
  accent,
  description,
}: {
  answer: string;
  accent: AccentColor;
  description: string;
}) {
  const c = accentMap[accent];
  return (
    <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 text-[10px] font-semibold uppercase tracking-wider ${accentMap.emerald.text}`}>
                Band 7
              </span>
              Complete Model Answer
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <CopyButton text={answer} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-sm leading-relaxed ${c.bg} p-4 rounded-xl ring-1 ${c.ring} whitespace-pre-wrap`}>
          {answer}
        </div>
      </CardContent>
    </Card>
  );
}

export function Part2FeedbackDisplay({ result }: { result: SpeakingFeedback }) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-8 flex flex-col items-center">
          <OverallBand score={result.estimated_band} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeedbackCard title="Fluency & Coherence">
          <p className="text-sm">{result.fluency_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Vocabulary">
          <p className="text-sm">{result.vocabulary_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Grammar">
          <p className="text-sm">{result.grammar_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Coherence">
          <p className="text-sm">{result.coherence_comment}</p>
        </FeedbackCard>
      </div>

      {result.band7_model_answer && (
        <ModelAnswerCard
          answer={result.band7_model_answer}
          accent="sky"
          description="A full ~2-minute monologue covering all bullet points. Study the structure, cohesion, and spoken register."
        />
      )}

      {result.grammar_errors_found?.length > 0 && (
        <GrammarErrorsList items={result.grammar_errors_found} />
      )}
      {result.useful_phrases?.length > 0 && (
        <UsefulPhrases items={result.useful_phrases} />
      )}
    </div>
  );
}

export function Part1FeedbackDisplay({
  result,
}: {
  result: SpeakingPart1Feedback;
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-8 flex flex-col items-center">
          <OverallBand score={result.estimated_band} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeedbackCard title="Fluency">
          <p className="text-sm">{result.fluency_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Vocabulary">
          <p className="text-sm">{result.vocabulary_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Grammar">
          <p className="text-sm">{result.grammar_comment}</p>
        </FeedbackCard>
      </div>

      {result.per_question?.length > 0 && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Per-question feedback & Band 7 models
            </CardTitle>
            <CardDescription>
              Compare your answer to the reference response for each question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5 text-sm">
              {result.per_question.map((qc, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="shrink-0 text-xs font-mono tabular-nums text-sky-300 mt-0.5">
                      Q{i + 1}
                    </span>
                    <p className="font-medium text-foreground/95">
                      {qc.question}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">
                    {qc.brief_comment}
                  </p>
                  {qc.band7_model_answer && (
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                          Band 7 model
                        </span>
                        <CopyButton text={qc.band7_model_answer} />
                      </div>
                      <p className="text-sm leading-relaxed bg-emerald-500/5 p-3 rounded-lg ring-1 ring-emerald-400/20 whitespace-pre-wrap">
                        {qc.band7_model_answer}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {result.natural_phrases_to_use?.length > 0 && (
        <FeedbackCard
          title="Natural phrases to try next time"
          icon={<Lightbulb className="w-4.5 h-4.5 text-amber-400" />}
        >
          <ul className="space-y-1.5 text-sm">
            {result.natural_phrases_to_use.map((p, i) => (
              <li key={i} className="text-muted-foreground italic">
                &ldquo;{p}&rdquo;
              </li>
            ))}
          </ul>
        </FeedbackCard>
      )}

      {result.grammar_errors_found?.length > 0 && (
        <GrammarErrorsList items={result.grammar_errors_found} />
      )}
    </div>
  );
}

export function Part3FeedbackDisplay({
  result,
}: {
  result: SpeakingPart3Feedback;
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardContent className="py-8 flex flex-col items-center">
          <OverallBand score={result.estimated_band} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedbackCard title="Fluency & Coherence">
          <p className="text-sm">{result.fluency_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Vocabulary (abstract range)">
          <p className="text-sm">{result.vocabulary_comment}</p>
        </FeedbackCard>
        <FeedbackCard title="Grammar (complex structures)">
          <p className="text-sm">{result.grammar_comment}</p>
        </FeedbackCard>
        <FeedbackCard
          title="Reasoning & depth"
          icon={<Target className="w-4.5 h-4.5 text-violet-400" />}
        >
          <p className="text-sm">{result.reasoning_comment}</p>
        </FeedbackCard>
      </div>

      {result.per_question?.length > 0 && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Idea development & Band 7 models
            </CardTitle>
            <CardDescription>
              See how each answer could be extended with structured reasoning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5 text-sm">
              {result.per_question.map((qc, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="shrink-0 text-xs font-mono tabular-nums text-violet-300 mt-0.5">
                      Q{i + 1}
                    </span>
                    <p className="font-medium text-foreground/95">
                      {qc.question}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">
                    {qc.idea_development_comment}
                  </p>
                  {qc.band7_model_answer && (
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                          Band 7 model
                        </span>
                        <CopyButton text={qc.band7_model_answer} />
                      </div>
                      <p className="text-sm leading-relaxed bg-violet-500/5 p-3 rounded-lg ring-1 ring-violet-400/20 whitespace-pre-wrap">
                        {qc.band7_model_answer}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {result.discourse_markers_to_use?.length > 0 && (
        <FeedbackCard
          title="Discourse markers to try"
          icon={<Lightbulb className="w-4.5 h-4.5 text-amber-400" />}
        >
          <ul className="space-y-1.5 text-sm">
            {result.discourse_markers_to_use.map((p, i) => (
              <li key={i} className="text-muted-foreground italic">
                &ldquo;{p}&rdquo;
              </li>
            ))}
          </ul>
        </FeedbackCard>
      )}

      {result.grammar_errors_found?.length > 0 && (
        <GrammarErrorsList items={result.grammar_errors_found} />
      )}
    </div>
  );
}

export function FullTestFeedbackDisplay({
  result,
}: {
  result: SpeakingFullFeedback;
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
        <div
          className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 blur-3xl pointer-events-none"
          aria-hidden
        />
        <CardContent className="py-10 flex flex-col items-center gap-6 relative">
          <OverallBand score={result.overall_band} />
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {(["part1", "part2", "part3"] as const).map((k, i) => (
              <div
                key={k}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-center"
              >
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Part {i + 1}
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {result.part_bands[k]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Criterion breakdown</CardTitle>
          <CardDescription>
            Pronunciation is not scored from a transcript alone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BandScore
            score={result.criterion_bands.fluency_coherence}
            label="Fluency & Coherence"
            size="lg"
          />
          <BandScore
            score={result.criterion_bands.lexical_resource}
            label="Lexical Resource"
            size="lg"
          />
          <BandScore
            score={result.criterion_bands.grammar}
            label="Grammatical Range & Accuracy"
            size="lg"
          />
          <div className="pt-2 text-xs text-muted-foreground italic">
            {result.criterion_bands.pronunciation_note}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedbackCard title="Strengths">
          <ul className="space-y-1.5 text-sm">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-foreground/90">
                {s}
              </li>
            ))}
          </ul>
        </FeedbackCard>
        <FeedbackCard title="Areas to improve">
          <ul className="space-y-1.5 text-sm">
            {result.improvements.map((s, i) => (
              <li key={i} className="text-foreground/90">
                {s}
              </li>
            ))}
          </ul>
        </FeedbackCard>
      </div>

      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl ring-1 ring-amber-400/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Next focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{result.next_focus}</p>
        </CardContent>
      </Card>

      {result.top_grammar_errors?.length > 0 && (
        <GrammarErrorsList items={result.top_grammar_errors} />
      )}
    </div>
  );
}
