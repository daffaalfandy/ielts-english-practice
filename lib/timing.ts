// Official IELTS time allocations, in seconds. Single source of truth.

export const WRITING_TASK_SECONDS: Record<1 | 2, number> = {
  1: 20 * 60,
  2: 40 * 60,
};

export const SPEAKING_PART2_PREP_SECONDS = 60;
export const SPEAKING_PART2_SPEAKING_SECONDS = 120;

// Per-question soft targets (not official per-question limits — IELTS times
// each part as a whole, but these nudge candidates toward exam pacing).
export const SPEAKING_PART1_PER_QUESTION_SECONDS = 60;
export const SPEAKING_PART3_PER_QUESTION_SECONDS = 90;
