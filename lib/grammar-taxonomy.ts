// ============================================================
// Canonical grammar-error taxonomy
// ------------------------------------------------------------
// Every AI prompt that emits a grammar error must tag it with a `category`
// drawn from GRAMMAR_CATEGORIES. A fixed enum (instead of free-text labels)
// is what lets error-aggregation merge the same weakness across grammar-check,
// writing, and speaking sessions — e.g. all tense slips land in one bucket
// instead of fragmenting into "Verb tense", "Past simple", "Future tense".
// ============================================================

export const GRAMMAR_CATEGORIES = [
  "tense",
  "subject-verb-agreement",
  "articles",
  "prepositions",
  "word-form",
  "plurals-countability",
  "pronouns",
  "sentence-structure",
  "word-order",
  "punctuation",
  "collocation",
  "word-choice",
  "other",
] as const;

export type GrammarCategory = (typeof GRAMMAR_CATEGORIES)[number];

// Finer breakdown for the tense category — optional, used to give tense-heavy
// learners more specific drills. Not required on every error.
export const TENSE_SUBTYPES = [
  "past-simple",
  "past-continuous",
  "past-perfect",
  "present-simple",
  "present-continuous",
  "present-perfect",
  "future-simple",
  "future-continuous",
  "conditional",
  "tense-consistency",
] as const;

export type TenseSubtype = (typeof TENSE_SUBTYPES)[number];

// Human-readable labels for UI display.
export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  tense: "Verb tenses",
  "subject-verb-agreement": "Subject–verb agreement",
  articles: "Articles (a/an/the)",
  prepositions: "Prepositions",
  "word-form": "Word form",
  "plurals-countability": "Plurals & countability",
  pronouns: "Pronouns",
  "sentence-structure": "Sentence structure",
  "word-order": "Word order",
  punctuation: "Punctuation",
  collocation: "Collocation",
  "word-choice": "Word choice",
  other: "Other",
};

export function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat as GrammarCategory] ?? cat;
}

// Keyword → canonical category. Ordered so more specific terms win.
const KEYWORD_MAP: [RegExp, GrammarCategory][] = [
  [/tense|past|present|future|perfect|continuous|progressive|conditional/i, "tense"],
  [/subject.?verb|agreement|s-?v-?a|singular\/plural verb|verb agree/i, "subject-verb-agreement"],
  [/article|a\/an\/the|\bdeterminer/i, "articles"],
  [/preposition/i, "prepositions"],
  [/word.?form|part of speech|noun\/verb|adjective\/adverb|derivation/i, "word-form"],
  [/plural|countable|uncountable|countability|singular noun/i, "plurals-countability"],
  [/pronoun|antecedent|it\/they|reference word/i, "pronouns"],
  [/sentence structure|fragment|run.?on|comma splice|clause|conjunction/i, "sentence-structure"],
  [/word order|ordering|inversion/i, "word-order"],
  [/punctuation|comma|apostrophe|capitali/i, "punctuation"],
  [/collocation|phrasal|idiom/i, "collocation"],
  [/word choice|vocabulary|wrong word|lexical|spelling/i, "word-choice"],
];

/**
 * Map any free-text or model-emitted category string onto the canonical
 * taxonomy. Already-canonical values pass through. Unknown strings that match
 * no keyword fall back to "other". This keeps old stored sessions (which used
 * free-text categories) mergeable with new taxonomy-tagged data.
 */
export function normalizeCategory(raw: string | undefined | null): GrammarCategory {
  if (!raw) return "other";
  const trimmed = raw.trim().toLowerCase();
  if ((GRAMMAR_CATEGORIES as readonly string[]).includes(trimmed)) {
    return trimmed as GrammarCategory;
  }
  for (const [re, cat] of KEYWORD_MAP) {
    if (re.test(raw)) return cat;
  }
  return "other";
}

/**
 * Prompt block injected into every grammar-emitting prompt. Instructs the model
 * to tag each error with a canonical category (and optional tense subtype).
 */
export const TAXONOMY_PROMPT_BLOCK = `=== GRAMMAR ERROR CATEGORIES — USE THESE EXACT VALUES ===
When you report a grammar error, set its "category" field to EXACTLY ONE of these canonical values (lowercase, verbatim):
${GRAMMAR_CATEGORIES.map((c) => `- ${c}`).join("\n")}

Rules:
- Choose the single best-fitting category. Do NOT invent new category names or use free-text labels.
- "tense" covers ALL verb-tense problems: wrong tense choice, tense inconsistency, misuse of perfect/continuous/conditional forms.
- For a "tense" error, ALSO set "subtype" to one of: ${TENSE_SUBTYPES.join(", ")} (the specific tense involved). Omit "subtype" for non-tense errors.
- Use "other" only when no category fits.`;
