# IELTS English Practice App

AI-powered IELTS practice application for Writing, Speaking, and Grammar — powered by Claude on your Claude subscription (Pro/Max), no pay-per-token API key needed.

## Features

- **Writing Practice** — IELTS Task 1 & Task 2 with band score feedback (1–9)
- **Speaking Practice** — Part 2 cue cards with speech-to-text and AI evaluation
- **Grammar Checker** — Paste any text and get annotated grammar corrections
- **Progress Dashboard** — Track scores, sessions, and streaks over time

## Prerequisites

- Node.js 20+
- A Claude subscription (Pro or Max) with [Claude Code](https://claude.com/claude-code) installed and logged in

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Configure (optional)
cp .env.example .env.local
# With Claude Code logged in on this machine, no token is needed —
# the Agent SDK picks up your login automatically.

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

## Running with Docker

The container can't see your host's Claude Code login, so generate a
long-lived subscription token once:

```bash
# 1. Generate a subscription OAuth token (one-time, on the host)
claude setup-token
# Copy the sk-ant-oat01-... token it prints

# 2. Configure
cp .env.example .env.local
# Edit .env.local — set CLAUDE_CODE_OAUTH_TOKEN to the token from step 1

# 3. Build and start
docker compose up --build

# 4. Open http://localhost:3000
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
- Claude Agent SDK (subscription-billed Claude access)
- Web Speech API (browser speech-to-text)
- Recharts (progress charts)
- localStorage (session history)

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Subscription token from `claude setup-token` (Docker only; not needed for local dev with Claude Code logged in) | `sk-ant-oat01-...` |
| `CLAUDE_MODEL` | Model override (optional) | `claude-sonnet-5` (default) |
| `CLAUDE_MAX_CONCURRENT` | Max simultaneous Claude requests (optional) | `3` (default) |

### Model options

| Model | Notes |
|---|---|
| `claude-sonnet-5` | Default — strong feedback quality, slow subscription-limit burn |
| `claude-opus-4-8` | Highest quality, burns weekly limits fastest |
| `claude-haiku-4-5` | Fastest responses, lighter feedback quality |
