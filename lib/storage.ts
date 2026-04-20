import type { SpeakingTheme } from "./ielts-data";

export interface WritingSession {
  id: string;
  type: "writing";
  timestamp: number;
  task: 1 | 2;
  prompt: string;
  response: string;
  feedback: WritingFeedback;
}

export interface WritingFeedback {
  overall_band: number;
  scores: {
    task_achievement: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammar: number;
  };
  strengths: string[];
  improvements: string[];
  band7_model_answer: string;
  vocabulary_suggestions: {
    original: string;
    better: string;
    example: string;
  }[];
}

// === Speaking feedback variants ===

export interface SpeakingFeedback {
  estimated_band: number;
  fluency_comment: string;
  vocabulary_comment: string;
  grammar_comment: string;
  coherence_comment: string;
  band7_model_answer: string;
  useful_phrases: string[];
  grammar_errors_found: { error: string; correction: string }[];
}

export interface SpeakingPart1Feedback {
  estimated_band: number;
  fluency_comment: string;
  vocabulary_comment: string;
  grammar_comment: string;
  per_question: {
    question: string;
    brief_comment: string;
    band7_model_answer: string;
  }[];
  natural_phrases_to_use: string[];
  grammar_errors_found: { error: string; correction: string }[];
}

export interface SpeakingPart3Feedback {
  estimated_band: number;
  fluency_comment: string;
  vocabulary_comment: string;
  grammar_comment: string;
  reasoning_comment: string;
  per_question: {
    question: string;
    idea_development_comment: string;
    band7_model_answer: string;
  }[];
  discourse_markers_to_use: string[];
  grammar_errors_found: { error: string; correction: string }[];
}

export interface SpeakingFullFeedback {
  overall_band: number;
  part_bands: { part1: number; part2: number; part3: number };
  criterion_bands: {
    fluency_coherence: number;
    lexical_resource: number;
    grammar: number;
    pronunciation_note: string;
  };
  strengths: string[];
  improvements: string[];
  top_grammar_errors: { error: string; correction: string }[];
  next_focus: string;
}

// === Speaking sessions (discriminated union) ===

interface SpeakingSessionBase {
  id: string;
  type: "speaking";
  timestamp: number;
}

export interface SpeakingPart1Session extends SpeakingSessionBase {
  part: "part1";
  topics: { topic: string; questions: string[] }[];
  answers: string[];
  feedback: SpeakingPart1Feedback;
}

export interface SpeakingPart2Session extends SpeakingSessionBase {
  part?: "part2"; // optional for back-compat with existing stored records
  cueCard: string;
  transcript: string;
  feedback: SpeakingFeedback;
}

export interface SpeakingPart3Session extends SpeakingSessionBase {
  part: "part3";
  theme: SpeakingTheme;
  pairedCueCard?: string;
  questions: string[];
  answers: string[];
  feedback: SpeakingPart3Feedback;
}

export interface SpeakingFullSession extends SpeakingSessionBase {
  part: "full";
  part1: {
    topics: { topic: string; questions: string[] }[];
    answers: string[];
  };
  part2: { cueCard: string; transcript: string };
  part3: {
    theme: SpeakingTheme;
    questions: string[];
    answers: string[];
  };
  feedback: SpeakingFullFeedback;
}

export type SpeakingSession =
  | SpeakingPart1Session
  | SpeakingPart2Session
  | SpeakingPart3Session
  | SpeakingFullSession;

export interface GrammarSession {
  id: string;
  type: "grammar";
  timestamp: number;
  input: string;
  feedback: GrammarFeedback;
}

export interface DrillExercise {
  sentence: string;      // with "___" in place of the blank/error
  correct: string;
  alternatives: string[]; // 3 distractors — full set of options is correct + alternatives shuffled
  rule: string;
  explanation: string;
  category: string;      // which focus category this drill targets
}

export interface DrillSession {
  id: string;
  type: "drill";
  timestamp: number;
  focusCategories: string[];
  exercises: DrillExercise[];
  answers: string[];     // user-chosen answers, same length as exercises
  score: number;         // number correct
}

export interface GrammarFeedback {
  corrected_text: string;
  errors: {
    original: string;
    correction: string;
    rule: string;
    category: string;
  }[];
  overall_comment: string;
  common_error_patterns: string[];
}

export type PracticeSession =
  | WritingSession
  | SpeakingSession
  | GrammarSession
  | DrillSession;

const STORAGE_KEY = "ielts-practice-sessions";

function normalizeSpeakingSession(raw: SpeakingSession): SpeakingSession {
  if ("part" in raw && raw.part) return raw;
  return { ...(raw as SpeakingPart2Session), part: "part2" };
}

function normalizeSession(raw: PracticeSession): PracticeSession {
  if (raw.type === "speaking") return normalizeSpeakingSession(raw);
  return raw;
}

export function getSessions(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return (parsed as PracticeSession[]).map(normalizeSession);
  } catch {
    return [];
  }
}

export function saveSession(session: PracticeSession): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getWritingSessions(): WritingSession[] {
  return getSessions().filter(
    (s): s is WritingSession => s.type === "writing"
  );
}

export function getSpeakingSessions(): SpeakingSession[] {
  return getSessions().filter(
    (s): s is SpeakingSession => s.type === "speaking"
  );
}

export function getGrammarSessions(): GrammarSession[] {
  return getSessions().filter(
    (s): s is GrammarSession => s.type === "grammar"
  );
}

export function getDrillSessions(): DrillSession[] {
  return getSessions().filter(
    (s): s is DrillSession => s.type === "drill"
  );
}

export function getStreak(): number {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const practiceDays = new Set(
    sessions.map((s) => {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  const sortedDays = Array.from(practiceDays).sort((a, b) => b - a);
  const oneDayMs = 86400000;

  // Check if user practiced today or yesterday (to not break streak mid-day)
  if (
    sortedDays[0] !== today.getTime() &&
    sortedDays[0] !== today.getTime() - oneDayMs
  ) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i - 1] - sortedDays[i] === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
