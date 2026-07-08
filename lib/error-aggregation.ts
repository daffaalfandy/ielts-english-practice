import {
  getSessions,
  type PracticeSession,
  type GrammarSession,
  type SpeakingSession,
  type WritingSession,
  type GrammarErrorItem,
} from "./storage";
import { normalizeCategory, type GrammarCategory } from "./grammar-taxonomy";

export interface ErrorCategoryStat {
  category: GrammarCategory;
  count: number;
  recentExamples: { error: string; correction: string }[];
  // Tense subtypes seen under this category (only populated for "tense"),
  // most frequent first — lets the coach and drills target specific tenses.
  subtypes: { subtype: string; count: number }[];
}

export interface ErrorAggregation {
  byCategory: ErrorCategoryStat[];
  topRecentErrors: { error: string; correction: string; source: string }[];
  totalErrors: number;
  totalSessions: number;
}

/**
 * Aggregate grammar errors across ALL session types into a single canonical
 * taxonomy. Every error (grammar-check, writing, speaking) is bucketed by its
 * canonical `category`, so the same weakness — e.g. verb tense — merges into one
 * bucket regardless of where it was made. Errors from sessions stored before the
 * taxonomy existed have no category and fall back to "other".
 *
 * Returned categories are sorted by count desc.
 */
export function aggregateErrors(
  sessions: PracticeSession[] = getSessions()
): ErrorAggregation {
  const categoryMap = new Map<GrammarCategory, ErrorCategoryStat>();
  const recentErrors: ErrorAggregation["topRecentErrors"] = [];

  const add = (item: GrammarErrorItem, source: string) => {
    const category = normalizeCategory(item.category);
    let stat = categoryMap.get(category);
    if (!stat) {
      stat = { category, count: 0, recentExamples: [], subtypes: [] };
      categoryMap.set(category, stat);
    }
    stat.count += 1;
    if (stat.recentExamples.length < 3) {
      stat.recentExamples.push({
        error: item.error,
        correction: item.correction,
      });
    }
    if (item.subtype) {
      const existing = stat.subtypes.find((s) => s.subtype === item.subtype);
      if (existing) existing.count += 1;
      else stat.subtypes.push({ subtype: item.subtype, count: 1 });
    }
    recentErrors.push({ error: item.error, correction: item.correction, source });
  };

  // Newest first so "recent" examples are actually recent
  const sorted = [...sessions].sort((a, b) => b.timestamp - a.timestamp);

  for (const s of sorted) {
    if (s.type === "grammar") {
      const gs = s as GrammarSession;
      for (const e of gs.feedback.errors ?? []) {
        add(
          {
            error: e.original,
            correction: e.correction,
            category: e.category,
            subtype: e.subtype,
          },
          "Grammar check"
        );
      }
    } else if (s.type === "writing") {
      const ws = s as WritingSession;
      for (const e of ws.feedback.grammar_errors_found ?? []) {
        add(e, "Writing");
      }
    } else if (s.type === "speaking") {
      const ss = s as SpeakingSession;
      const part = "part" in ss && ss.part ? ss.part : "part2";
      const fb = ss.feedback as {
        grammar_errors_found?: GrammarErrorItem[];
        top_grammar_errors?: GrammarErrorItem[];
      };
      const errs = fb.grammar_errors_found ?? fb.top_grammar_errors ?? [];
      for (const e of errs) {
        add(e, `Speaking (${part})`);
      }
    }
  }

  const byCategory = Array.from(categoryMap.values())
    .map((stat) => ({
      ...stat,
      subtypes: stat.subtypes.sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);

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
