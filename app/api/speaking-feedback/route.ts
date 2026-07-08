import { streamClaudeJson, withApiError } from "@/lib/claude";
import { SPEAKING_FEEDBACK_PROMPT } from "@/lib/prompts";

export const POST = withApiError("speaking-feedback", async (req) => {
  const { cueCard, transcript } = await req.json();

  if (!transcript || !cueCard) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  return streamClaudeJson({
    systemPrompt: SPEAKING_FEEDBACK_PROMPT,
    userContent: `IELTS Part 2 Cue Card: "${cueCard}"\n\nStudent's spoken response (transcribed):\n${transcript}`,
  });
});
