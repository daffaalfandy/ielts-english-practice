import { getClient, getModel } from "@/lib/anthropic";
import { SPEAKING_FULL_FEEDBACK_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const { part1, part2, part3 } = (await req.json()) as FullTestPayload;

    if (!part1 || !part2 || !part3) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const part1Questions = part1.topics.flatMap((t) => t.questions);
    const part1QA = part1Questions
      .map(
        (q, i) => `Q${i + 1}: ${q}\nA: ${part1.answers[i] ?? "(no answer)"}`
      )
      .join("\n");
    const part3QA = part3.questions
      .map(
        (q, i) => `Q${i + 1}: ${q}\nA: ${part3.answers[i] ?? "(no answer)"}`
      )
      .join("\n");

    const userContent = `=== PART 1 (Personal Q&A) ===
${part1QA}

=== PART 2 (Cue Card Monologue) ===
Cue card: "${part2.cueCard}"
Transcript:
${part2.transcript}

=== PART 3 (Discussion, theme: ${part3.theme}) ===
${part3QA}`;

    const stream = await getClient().chat.completions.create({
      model: getModel(),
      max_tokens: 4096,
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SPEAKING_FULL_FEEDBACK_PROMPT },
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
    console.error("[speaking-full-feedback] Error:", msg);
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
