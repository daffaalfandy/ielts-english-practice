import { getClient, getModel } from "@/lib/anthropic";
import { SPEAKING_PART3_FEEDBACK_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { theme, questions, answers, pairedCueCard } = (await req.json()) as {
      theme: string;
      questions: string[];
      answers: string[];
      pairedCueCard?: string;
    };

    if (!questions?.length || !answers?.length) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const qa = questions
      .map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i] ?? "(no answer)"}`)
      .join("\n\n");
    const context = pairedCueCard
      ? `The Part 3 discussion followed this Part 2 cue card: "${pairedCueCard}".\nTheme: ${theme}.\n\n`
      : `Discussion theme: ${theme}.\n\n`;

    const stream = await getClient().chat.completions.create({
      model: getModel(),
      max_tokens: 2048,
      stream: true,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SPEAKING_PART3_FEEDBACK_PROMPT },
        {
          role: "user",
          content: `${context}IELTS Part 3 questions and the candidate's transcribed answers:\n\n${qa}`,
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
    console.error("[speaking-part3-feedback] Error:", msg);
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 }
    );
  }
}
