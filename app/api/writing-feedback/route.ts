import { streamClaudeJson, withApiError } from "@/lib/claude";
import { WRITING_FEEDBACK_PROMPT } from "@/lib/prompts";
import { describeVisual } from "@/lib/visual-summary";

export const POST = withApiError("writing-feedback", async (req) => {
  const { prompt, response, task, visualData } = await req.json();

  if (!response || !prompt) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let chartSection = "";
  if (visualData) {
    const summary = describeVisual(visualData);
    const jsonBlock = `\`\`\`json\n${JSON.stringify(visualData, null, 2)}\n\`\`\``;
    chartSection = summary
      ? `\n\nVisual (the candidate must describe this):\n${summary}\n\nStructured data for reference:\n${jsonBlock}`
      : `\n\nChart data (the candidate must describe this):\n${jsonBlock}`;
  }

  const userContent = `IELTS Writing Task ${task || 2} Prompt: "${prompt}"${chartSection}\n\nStudent's response:\n${response}`;

  return streamClaudeJson({
    systemPrompt: WRITING_FEEDBACK_PROMPT,
    userContent,
  });
});
