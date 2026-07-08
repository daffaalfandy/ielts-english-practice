import { streamClaudeJson, withApiError } from "@/lib/claude";
import { SPEAKING_PART1_FEEDBACK_PROMPT } from "@/lib/prompts";

interface Part1Topic {
  topic: string;
  questions: string[];
}

export const POST = withApiError("speaking-part1-feedback", async (req) => {
  const { topics, answers } = (await req.json()) as {
    topics: Part1Topic[];
    answers: string[];
  };

  if (!topics?.length || !answers?.length) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const flatQuestions = topics.flatMap((t) => t.questions);
  const qa = flatQuestions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i] ?? "(no answer)"}`)
    .join("\n\n");

  return streamClaudeJson({
    systemPrompt: SPEAKING_PART1_FEEDBACK_PROMPT,
    userContent: `IELTS Part 1 questions and the candidate's transcribed answers:\n\n${qa}`,
  });
});
