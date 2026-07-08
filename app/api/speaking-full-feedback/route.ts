import { streamClaudeJson, withApiError } from "@/lib/claude";
import { SPEAKING_FULL_FEEDBACK_PROMPT } from "@/lib/prompts";

interface FullTestPayload {
  part1: {
    topics: { topic: string; questions: string[] }[];
    answers: string[];
  };
  part2: { cueCard: string; transcript: string };
  part3: {
    theme: string;
    questions: string[];
    answers: string[];
  };
}

export const POST = withApiError("speaking-full-feedback", async (req) => {
  const { part1, part2, part3 } = (await req.json()) as FullTestPayload;

  if (!part1 || !part2 || !part3) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const part1Questions = part1.topics.flatMap((t) => t.questions);
  const part1QA = part1Questions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${part1.answers[i] ?? "(no answer)"}`)
    .join("\n");
  const part3QA = part3.questions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${part3.answers[i] ?? "(no answer)"}`)
    .join("\n");

  const userContent = `=== PART 1 (Personal Q&A) ===
${part1QA}

=== PART 2 (Cue Card Monologue) ===
Cue card: "${part2.cueCard}"
Transcript:
${part2.transcript}

=== PART 3 (Discussion, theme: ${part3.theme}) ===
${part3QA}`;

  return streamClaudeJson({
    systemPrompt: SPEAKING_FULL_FEEDBACK_PROMPT,
    userContent,
  });
});
