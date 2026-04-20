# IELTS English Practice App

AI-powered IELTS practice application for Writing, Speaking, and Grammar — works with any OpenAI-compatible API.

## Features

- **Writing Practice** — IELTS Task 1 & Task 2 with band score feedback (1–9)
- **Speaking Practice** — Part 2 cue cards with speech-to-text and AI evaluation
- **Grammar Checker** — Paste any text and get annotated grammar corrections
- **Progress Dashboard** — Track scores, sessions, and streaks over time

## Prerequisites

- Node.js 20+
- An API key from any OpenAI-compatible provider (OpenRouter, Perplexity, OpenAI, etc.)

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Configure your LLM provider
cp .env.example .env.local
# Edit .env.local — set LLM_API_KEY, LLM_BASE_URL, and LLM_MODEL

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

## Running with Docker

```bash
# 1. Configure your LLM provider
cp .env.example .env.local
# Edit .env.local — set LLM_API_KEY, LLM_BASE_URL, and LLM_MODEL

# 2. Build and start
docker compose up --build

# 3. Open http://localhost:3000
```

### Docker commands

```bash
docker compose up -d          # Start in background
docker compose logs -f        # View logs
docker compose down           # Stop
docker compose up --build     # Rebuild after changes
```

## Tech Stack

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- OpenAI SDK (works with any compatible provider)
- Web Speech API (browser speech-to-text)
- Recharts (progress charts)
- localStorage (session history)

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `LLM_API_KEY` | Your API key | `sk-...` |
| `LLM_BASE_URL` | Provider's API base URL | `https://openrouter.ai/api/v1` |
| `LLM_MODEL` | Model to use | `google/gemini-2.0-flash-001` |

### Provider examples

| Provider | `LLM_BASE_URL` | `LLM_MODEL` |
|---|---|---|
| OpenRouter | `https://openrouter.ai/api/v1` | `google/gemini-2.0-flash-001` |
| Perplexity | `https://api.perplexity.ai` | `sonar-pro` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
