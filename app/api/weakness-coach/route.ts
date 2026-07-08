import { streamClaudeJson, withApiError } from "@/lib/claude";
import { WEAKNESS_COACH_PROMPT } from "@/lib/prompts";

interface CoachCategory {
  category: string;
  count: number;
  subtypes?: { subtype: string; count: number }[];
  examples?: { error: string; correction: string }[];
}

interface CoachRequest {
  categories: CoachCategory[];
  totalErrors: number;
  totalSessions: number;
}

export const POST = withApiError("weakness-coach", async (req) => {
  const { categories, totalErrors, totalSessions } =
    (await req.json()) as CoachRequest;

  if (!categories?.length) {
    return Response.json(
      { error: "categories is required (non-empty)" },
      { status: 400 }
    );
  }

  const block = categories
    .map((c) => {
      const subtypes = c.subtypes?.length
        ? `\n  tense breakdown: ${c.subtypes
            .map((s) => `${s.subtype} (${s.count})`)
            .join(", ")}`
        : "";
      const examples = c.examples?.length
        ? `\n  examples: ${c.examples
            .map((e) => `"${e.error}" → "${e.correction}"`)
            .join("; ")}`
        : "";
      return `- ${c.category}: ${c.count} mistake(s)${subtypes}${examples}`;
    })
    .join("\n");

  const userContent = `Student grammar-mistake summary across ${totalSessions} practice session(s), ${totalErrors} total errors.

Categories (worst first):
${block}

Diagnose the single highest-leverage weakness to fix next and produce the study plan.`;

  return streamClaudeJson({
    systemPrompt: WEAKNESS_COACH_PROMPT,
    userContent,
  });
});
