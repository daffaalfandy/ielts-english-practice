import { streamClaudeJson, withApiError } from "@/lib/claude";
import { GRAMMAR_DRILLS_PROMPT } from "@/lib/prompts";

interface DrillRequest {
  focusCategories: string[];
  count?: number;
  recentExamples?: { error: string; correction: string }[];
}

export const POST = withApiError("grammar-drills", async (req) => {
  const {
    focusCategories,
    count = 10,
    recentExamples = [],
  } = (await req.json()) as DrillRequest;

  if (!focusCategories?.length) {
    return Response.json(
      { error: "focusCategories is required (non-empty)" },
      { status: 400 }
    );
  }

  const examplesBlock = recentExamples.length
    ? `\n\nRecent mistakes the student has made (drills should address these patterns):\n${recentExamples
        .slice(0, 8)
        .map((e) => `- "${e.error}" → "${e.correction}"`)
        .join("\n")}`
    : "";

  const userContent = `Generate ${count} grammar exercises for this student.

Focus categories:
${focusCategories.map((c) => `- ${c}`).join("\n")}${examplesBlock}

Distribute the ${count} exercises roughly evenly across the focus categories.`;

  return streamClaudeJson({
    systemPrompt: GRAMMAR_DRILLS_PROMPT,
    userContent,
  });
});
