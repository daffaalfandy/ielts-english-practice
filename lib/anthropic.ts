import OpenAI from "openai";

let _client: OpenAI | null = null;
let _validated = false;

function validateEnv() {
  if (_validated) return;
  _validated = true;

  const key = process.env.LLM_API_KEY;
  const baseURL = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;

  console.log("\n┌─────────────────────────────────────");
  console.log("│ LLM Configuration");
  console.log("├─────────────────────────────────────");
  console.log(`│ LLM_BASE_URL : ${baseURL || "❌ NOT SET"}`);
  console.log(`│ LLM_MODEL    : ${model || "⚠️  NOT SET (fallback: gpt-4o-mini)"}`);
  console.log(`│ LLM_API_KEY  : ${key ? `${key.slice(0, 8)}...${key.slice(-4)} ✅` : "❌ NOT SET"}`);
  console.log("└─────────────────────────────────────\n");

  if (!key) {
    console.error("⚠️  LLM_API_KEY is missing — API routes will fail. Set it in .env.local");
  }
  if (!baseURL) {
    console.error("⚠️  LLM_BASE_URL is missing — API routes will fail. Set it in .env.local");
  }
}

export function getClient(): OpenAI {
  if (!_client) {
    validateEnv();
    _client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_BASE_URL,
    });
  }
  return _client;
}

export function getModel(): string {
  return process.env.LLM_MODEL || "gpt-4o-mini";
}
