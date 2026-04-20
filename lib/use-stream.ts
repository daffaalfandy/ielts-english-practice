"use client";

import { useState, useCallback } from "react";
import { jsonrepair } from "jsonrepair";

function extractJson(text: string): string {
  // Strip common wrappers: markdown fences, leading prose
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) return fenced[1].trim();
  // Fall back to the first {...} or [...] span
  const first = text.search(/[{[]/);
  if (first < 0) return text.trim();
  return text.slice(first).trim();
}

function parseModelJson<T>(raw: string): T {
  const body = extractJson(raw);
  try {
    return JSON.parse(body) as T;
  } catch {
    // Attempt to repair common issues (missing braces/commas, trailing text)
    return JSON.parse(jsonrepair(body)) as T;
  }
}

export function useStream<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<T | null>(null);

  const submit = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);
      setRawText("");
      setResult(null);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `Request failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  setError(parsed.error);
                  continue;
                }
                if (parsed.text) {
                  accumulated += parsed.text;
                  setRawText(accumulated);
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }

        // Try to parse the full accumulated text as JSON (with repair fallback)
        try {
          const parsed = parseModelJson<T>(accumulated);
          setResult(parsed);
        } catch {
          setError("Could not parse AI response. Raw output shown below.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setRawText("");
    setResult(null);
  }, []);

  return { isLoading, error, rawText, result, submit, reset };
}
