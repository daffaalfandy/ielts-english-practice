import {
  getSessions,
  type PracticeSession,
  type GrammarSession,
  type SpeakingSession,
  type WritingSession,
} from "./storage";

export interface ErrorCategoryStat {
  category: string;
  count: number;
  recentExamples: { error: string; correction: string }[];
}

export interface ErrorAggregation {
  byCategory: ErrorCategoryStat[];
  topRecentErrors: { error: string; correction: string; source: string }[];
  totalErrors: number;
  totalSessions: number;
}

/**
 * Aggregate grammar errors across all session types.
 *
 * - GrammarSession has categorised errors → used directly.
 * - Writing/Speaking feedback has uncategorised {error, correction} pairs → counted
 *   under a synthetic "Writing/Speaking mistakes" bucket so they show up in the focus list.
 *
 * Returned categories are sorted by count desc.
 */
export function aggregateErrors(
  sessions: PracticeSession[] = getSessions()
): ErrorAggregation {
  const categoryMap = new Map<string, ErrorCategoryStat>();
  const recentErrors: ErrorAggregation["topRecentErrors"] = [];

  const addToCategory = (
    category: string,
    error: string,
    correction: string
  ) => {
    const existing = categoryMap.get(category);
    if (existing) {
      existing.count += 1;
      if (existing.recentExamples.length < 3) {
        existing.recentExamples.push({ error, correction });
      }
    } else {
      categoryMap.set(category, {
        category,
        count: 1,
        recentExamples: [{ error, correction }],
      });
    }
  };

  // Newest first so "recent" examples are actually recent
  const sorted = [...sessions].sort((a, b) => b.timestamp - a.timestamp);

  for (const s of sorted) {
    if (s.type === "grammar") {
      const gs = s as GrammarSession;
      for (const e of gs.feedback.errors ?? []) {
        addToCategory(e.category || "Other", e.original, e.correction);
        recentErrors.push({
          error: e.original,
          correction: e.correction,
          source: "Grammar check",
        });
      }
    } else if (s.type === "writing") {
      const ws = s as WritingSession;
      // Writing feedback has no category field; bucket as "Essay grammar"
      // Also not strictly guaranteed to exist on old records
      const errs =
        (ws.feedback as { grammar_errors_found?: { error: string; correction: string }[] })
          .grammar_errors_found ?? [];
      for (const e of errs) {
        addToCategory("Essay grammar", e.error, e.correction);
        recentErrors.push({
          error: e.error,
          correction: e.correction,
          source: "Writing",
        });
      }
    } else if (s.type === "speaking") {
      const ss = s as SpeakingSession;
      const part = "part" in ss && ss.part ? ss.part : "part2";
      const bucketMap: Record<string, string> = {
        part1: "Speaking Part 1 grammar",
        part2: "Speaking Part 2 grammar",
        part3: "Speaking Part 3 grammar",
        full: "Speaking full-test grammar",
      };
      const bucket = bucketMap[part] ?? "Speaking grammar";
      const fb = ss.feedback as {
        grammar_errors_found?: { error: string; correction: string }[];
        top_grammar_errors?: { error: string; correction: string }[];
      };
      const errs = fb.grammar_errors_found ?? fb.top_grammar_errors ?? [];
      for (const e of errs) {
        addToCategory(bucket, e.error, e.correction);
        recentErrors.push({
          error: e.error,
          correction: e.correction,
          source: `Speaking (${part})`,
        });
      }
    }
  }

  const byCategory = Array.from(categoryMap.values()).sort(
    (a, b) => b.count - a.count
  );
  const totalErrors = byCategory.reduce((acc, c) => acc + c.count, 0);

  return {
    byCategory,
    topRecentErrors: recentErrors.slice(0, 10),
    totalErrors,
    totalSessions: sessions.filter(
      (s) => s.type === "grammar" || s.type === "writing" || s.type === "speaking"
    ).length,
  };
}
