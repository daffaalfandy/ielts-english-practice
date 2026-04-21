import { getClient, getModel } from "@/lib/anthropic";
import { WRITING_FEEDBACK_PROMPT } from "@/lib/prompts";
import { describeVisual } from "@/lib/visual-summary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, response, task, visualData } = await req.json();

    if (!response || !prompt) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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

    const stream = await getClient().chat.completions.create({
      model: getModel(),
      max_tokens: 3072,
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: WRITING_FEEDBACK_PROMPT },
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
    console.error("[writing-feedback] Error:", msg);
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
