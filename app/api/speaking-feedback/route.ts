import { getClient, getModel } from "@/lib/anthropic";
import { SPEAKING_FEEDBACK_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cueCard, transcript } = await req.json();

    if (!transcript || !cueCard) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stream = await getClient().chat.completions.create({
      model: getModel(),
      max_tokens: 3072,
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SPEAKING_FEEDBACK_PROMPT },
        {
          role: "user",
          content: `IELTS Part 2 Cue Card: "${cueCard}"\n\nStudent's spoken response (transcribed):\n${transcript}`,
        },
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
    console.error("[speaking-feedback] Error:", msg);
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
