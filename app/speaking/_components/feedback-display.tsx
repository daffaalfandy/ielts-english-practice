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
import { Target, Lightbulb } from "lucide-react";

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

      {result.model_answer_opening && (
        <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Model Answer Opening</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed bg-sky-500/10 p-4 rounded-xl ring-1 ring-sky-400/20 italic">
              {result.model_answer_opening}
            </p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-base">Per-question notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside text-sm">
              {result.per_question.map((qc, i) => (
                <li key={i}>
                  <span className="text-foreground/90">{qc.question}</span>
                  <p className="pl-5 mt-1 text-muted-foreground">
                    {qc.brief_comment}
                  </p>
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
            <CardTitle className="text-base">Idea development</CardTitle>
            <CardDescription>How well each answer was extended</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside text-sm">
              {result.per_question.map((qc, i) => (
                <li key={i}>
                  <span className="text-foreground/90">{qc.question}</span>
                  <p className="pl-5 mt-1 text-muted-foreground">
                    {qc.idea_development_comment}
                  </p>
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
