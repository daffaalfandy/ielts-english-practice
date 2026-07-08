import { streamClaudeJson, withApiError } from "@/lib/claude";
import { SPEAKING_PART3_FEEDBACK_PROMPT } from "@/lib/prompts";

export const POST = withApiError("speaking-part3-feedback", async (req) => {
  const { theme, questions, answers, pairedCueCard } = (await req.json()) as {
    theme: string;
    questions: string[];
    answers: string[];
    pairedCueCard?: string;
  };

  if (!questions?.length || !answers?.length) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const qa = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i] ?? "(no answer)"}`)
    .join("\n\n");
  const context = pairedCueCard
    ? `The Part 3 discussion followed this Part 2 cue card: "${pairedCueCard}".\nTheme: ${theme}.\n\n`
    : `Discussion theme: ${theme}.\n\n`;

  return streamClaudeJson({
    systemPrompt: SPEAKING_PART3_FEEDBACK_PROMPT,
    userContent: `${context}IELTS Part 3 questions and the candidate's transcribed answers:\n\n${qa}`,
  });
});
