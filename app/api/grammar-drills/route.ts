import { getClient, getModel } from "@/lib/anthropic";
import { GRAMMAR_DRILLS_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

interface DrillRequest {
  focusCategories: string[];
  count?: number;
  recentExamples?: { error: string; correction: string }[];
}

export async function POST(req: NextRequest) {
  try {
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

    const stream = await getClient().chat.completions.create({
      model: getModel(),
      max_tokens: 3072,
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: GRAMMAR_DRILLS_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[grammar-drills] Error:", msg);
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
