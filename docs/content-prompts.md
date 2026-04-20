# Content Generation Prompts

These prompts regenerate the Part 1 topic sets and Part 3 question banks used by
the speaking module. Paste one into your local LLM (e.g. Ollama), copy the
output, and drop it into `lib/ielts-data.ts`.

The shipped defaults are reasonable starting content — regenerate only if you
want fresher or more varied material.

---

## Prompt 1 — Part 1 topic sets

Target: 12 `SpeakingPart1TopicSet` entries, each with 4–5 questions.

````
You are an IELTS content specialist. Generate 12 authentic IELTS Speaking
Part 1 topic sets as a strict TypeScript array literal.

Requirements:
- Each topic is a familiar, personal subject used in real Part 1 exams.
- Cover this exact topic set (one entry each, in this order):
  1. Hometown
  2. Work/Study
  3. Hobbies & free time
  4. Food
  5. Weather
  6. Technology
  7. Travel
  8. Music
  9. Reading
 10. Clothes
 11. Weekends
 12. Sleep
- Each entry has 4–5 questions. Phrasing must match how an IELTS examiner
  actually asks — short, direct, natural spoken English. Avoid overly
  academic vocabulary.
- Question 1 should be an opener about the candidate's current situation.
- Mix in at least one question per topic that invites comparison or change
  over time ("Has it changed...?", "Did you use to...?", "Would you prefer...?").
- No duplicate wording across topics.

Output ONLY a TypeScript array literal matching this exact shape, nothing else:

```ts
export const speakingPart1Topics: SpeakingPart1TopicSet[] = [
  {
    id: "p1-hometown",
    topic: "Hometown",
    questions: [
      "Where is your hometown?",
      "What do you like most about it?",
      "...",
      "..."
    ]
  },
  { id: "p1-work-study", topic: "Work or study", questions: [ ... ] },
  ...
];
```

IDs must follow the pattern `p1-<kebab-case-topic>`.
````

---

## Prompt 2 — Part 3 question bank

Target: one `string[]` of 5 questions per theme, covering all 10 themes.

````
You are an IELTS content specialist. Generate IELTS Speaking Part 3 questions
as a strict TypeScript object literal, keyed by theme.

Themes (must include all 10):
  place, person, object, event, experience, skill, activity, media, food, goal

Requirements:
- Exactly 5 questions per theme.
- Questions must be abstract/opinion-based, not personal (Part 3 asks
  candidates to discuss society, trends, and ideas — NOT their own life).
- Match real IELTS Speaking Part 3 phrasing:
    "Why do people...?", "How has ... changed...?", "Do you think ...?",
    "Some people say ... — what do you think?"
- At least one question per theme should require a comparison or judgment.
- At least one question per theme should invite a societal/cultural angle.
- No duplicate wording across themes.

Output ONLY a TypeScript object literal, nothing else:

```ts
export const speakingPart3Questions: Record<SpeakingTheme, string[]> = {
  place: [
    "Why do people enjoy visiting new places?",
    "...",
    "...",
    "...",
    "..."
  ],
  person: [ ... ],
  object: [ ... ],
  event: [ ... ],
  experience: [ ... ],
  skill: [ ... ],
  activity: [ ... ],
  media: [ ... ],
  food: [ ... ],
  goal: [ ... ],
};
```
````

---

## Integration

1. Run prompt 1 and/or 2 through your local LLM.
2. Verify the output compiles (wrap in a scratch `.ts` file with the matching
   imports to type-check).
3. Paste the array/object literal over the existing definition in
   `lib/ielts-data.ts`.
4. Run `npm run build` — zero TS errors means you're good.
