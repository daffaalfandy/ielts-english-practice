import { query } from "@anthropic-ai/claude-agent-sdk";
import { NextRequest } from "next/server";

const DEFAULT_MODEL = "claude-sonnet-5";

// Each request spawns a Claude Code subprocess — cap how many run at once so
// a burst (e.g. the full speaking test) can't exhaust the container.
const MAX_CONCURRENT = Number(process.env.CLAUDE_MAX_CONCURRENT) || 3;
let active = 0;
const waiters: (() => void)[] = [];

async function acquireSlot(): Promise<void> {
  if (active >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  active++;
}

function releaseSlot(): void {
  active--;
  waiters.shift()?.();
}

function getModel(): string {
  return process.env.CLAUDE_MODEL || DEFAULT_MODEL;
}

/**
 * Runs a single-turn Claude request (via the Claude Agent SDK, authenticated
 * with the Claude subscription) and returns an SSE Response in the app's
 * wire format: `data: {"text": ...}` deltas followed by `data: [DONE]`.
 */
export function streamClaudeJson(opts: {
  systemPrompt: string;
  userContent: string;
}): Response {
  const encoder = new TextEncoder();
  let q: ReturnType<typeof query> | null = null;
  let cancelled = false;

  const readable = new ReadableStream({
    async start(controller) {
      await acquireSlot();
      try {
        q = query({
          prompt: opts.userContent,
          options: {
            systemPrompt: opts.systemPrompt,
            model: getModel(),
            // tools: [] removes built-in tools from context; maxTurns: 1
            // stops the agent loop even if the model still emits a tool call
            maxTurns: 1,
            tools: [],
            settingSources: [],
            includePartialMessages: true,
          },
        });

        for await (const msg of q) {
          if (cancelled) break;
          if (
            msg.type === "stream_event" &&
            msg.event.type === "content_block_delta" &&
            msg.event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: msg.event.delta.text })}\n\n`
              )
            );
          }
        }
        if (!cancelled) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("[claude] Stream error:", msg);
        if (!cancelled) {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
            );
          } catch {
            // stream already errored/cancelled — nothing left to notify
          }
        }
      } finally {
        releaseSlot();
        if (!cancelled) {
          try {
            controller.close();
          } catch {
            // already closed
          }
        }
      }
    },
    // Client disconnected — stop the subprocess so it doesn't keep
    // generating (and burning subscription limits) for nobody.
    async cancel() {
      cancelled = true;
      try {
        await q?.interrupt();
      } catch {
        // subprocess may have already exited
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
}

/**
 * Wraps a route handler with the shared try/catch → 500 boilerplate.
 */
export function withApiError(
  label: string,
  handler: (req: NextRequest) => Promise<Response>
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[${label}] Error:`, msg);
      return Response.json(
        { error: `AI request failed: ${msg}` },
        { status: 500 }
      );
    }
  };
}
