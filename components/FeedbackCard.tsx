"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Lightbulb, BookOpen } from "lucide-react";

interface FeedbackCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function FeedbackCard({ title, icon, children }: FeedbackCardProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function StrengthsList({ items }: { items: string[] }) {
  return (
    <FeedbackCard
      title="Strengths"
      icon={<CheckCircle className="w-4.5 h-4.5 text-emerald-400" />}
    >
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm leading-relaxed"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
    </FeedbackCard>
  );
}

export function ImprovementsList({ items }: { items: string[] }) {
  return (
    <FeedbackCard
      title="Areas for Improvement"
      icon={<AlertCircle className="w-4.5 h-4.5 text-orange-400" />}
    >
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm leading-relaxed"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
            <span className="text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
    </FeedbackCard>
  );
}

export function VocabSuggestions({
  items,
}: {
  items: { original: string; better: string; example: string }[];
}) {
  return (
    <FeedbackCard
      title="Vocabulary Suggestions"
      icon={<BookOpen className="w-4.5 h-4.5 text-sky-400" />}
    >
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="text-sm rounded-xl bg-white/5 ring-1 ring-white/10 p-3"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge
                variant="outline"
                className="text-rose-300 border-rose-400/30 bg-rose-500/10"
              >
                {item.original}
              </Badge>
              <span className="text-muted-foreground">&rarr;</span>
              <Badge
                variant="outline"
                className="text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
              >
                {item.better}
              </Badge>
            </div>
            <p className="text-muted-foreground italic text-xs leading-relaxed">
              &ldquo;{item.example}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </FeedbackCard>
  );
}

export function GrammarErrorsList({
  items,
}: {
  items: { error: string; correction: string }[];
}) {
  return (
    <FeedbackCard
      title="Grammar Errors Found"
      icon={<AlertCircle className="w-4.5 h-4.5 text-rose-400" />}
    >
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="text-sm rounded-xl bg-white/5 ring-1 ring-white/10 p-3 space-y-1"
          >
            <p className="text-rose-300/90 line-through">{item.error}</p>
            <p className="text-emerald-300">{item.correction}</p>
          </div>
        ))}
      </div>
    </FeedbackCard>
  );
}

export function UsefulPhrases({ items }: { items: string[] }) {
  return (
    <FeedbackCard
      title="Useful Phrases"
      icon={<Lightbulb className="w-4.5 h-4.5 text-amber-400" />}
    >
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm text-muted-foreground flex items-start gap-2"
          >
            <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400/80 shrink-0" />
            <span className="italic">&ldquo;{item}&rdquo;</span>
          </li>
        ))}
      </ul>
    </FeedbackCard>
  );
}
