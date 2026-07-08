import { streamClaudeJson, withApiError } from "@/lib/claude";
import { GRAMMAR_CHECK_PROMPT } from "@/lib/prompts";

export const POST = withApiError("grammar-check", async (req) => {
  const { text } = await req.json();

  if (!text) {
    return Response.json(
      { error: "Missing required text field" },
      { status: 400 }
    );
  }

  return streamClaudeJson({
    systemPrompt: GRAMMAR_CHECK_PROMPT,
    userContent: `Please check the following text for grammar errors:\n\n${text}`,
  });
});
