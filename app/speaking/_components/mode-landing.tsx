"use client";

import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Mic,
  Users,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

const modes = [
  {
    key: "part1",
    eyebrow: "Part 1",
    title: "Personal Q&A",
    description:
      "Answer a short series of everyday questions on three familiar topics — the way the exam begins.",
    duration: "~5 min",
    questions: "~12 questions",
    icon: MessageCircle,
    gradient: "from-sky-400 to-indigo-500",
    accent: "text-sky-300",
    ring: "ring-sky-400/30",
    glow: "shadow-sky-500/25",
  },
  {
    key: "part2",
    eyebrow: "Part 2",
    title: "Cue Card Monologue",
    description:
      "Speak for two minutes on a cue card, after one minute of preparation. Structured IELTS format.",
    duration: "~3 min",
    questions: "1 prompt, 4 bullets",
    icon: Mic,
    gradient: "from-emerald-400 to-teal-500",
    accent: "text-emerald-300",
    ring: "ring-emerald-400/30",
    glow: "shadow-emerald-500/25",
  },
  {
    key: "part3",
    eyebrow: "Part 3",
    title: "Abstract Discussion",
    description:
      "Go deeper into the theme of your Part 2 card with opinion and reasoning questions.",
    duration: "~5 min",
    questions: "5 questions",
    icon: Users,
    gradient: "from-violet-400 to-fuchsia-500",
    accent: "text-violet-300",
    ring: "ring-violet-400/30",
    glow: "shadow-violet-500/25",
  },
  {
    key: "full",
    eyebrow: "Full Test",
    title: "All three parts, scored together",
    description:
      "Complete a full simulated Speaking test. Get a holistic band score with per-part breakdown at the end.",
    duration: "~12 min",
    questions: "Parts 1 · 2 · 3",
    icon: Trophy,
    gradient: "from-amber-400 to-orange-500",
    accent: "text-amber-300",
    ring: "ring-amber-400/30",
    glow: "shadow-amber-500/25",
    featured: true,
  },
] as const;

export function ModeLanding() {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/20 text-xs font-medium text-emerald-300">
          <Sparkles className="w-3 h-3" />
          Speaking
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Choose your{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
            practice mode
          </span>
        </h1>
        <p className="text-muted-foreground">
          Drill a single part or run a full IELTS Speaking test end-to-end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {modes.map((m) => {
          const Icon = m.icon;
          const featured = "featured" in m && m.featured;
          return (
            <button
              key={m.key}
              onClick={() => router.push(`/speaking?mode=${m.key}`)}
              className={`group relative text-left overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 p-6 transition-all duration-300 hover:ring-white/20 hover:-translate-y-0.5 hover:bg-card/80 ${
                featured ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`absolute -top-24 -right-16 w-64 h-64 rounded-full bg-gradient-to-br ${m.gradient} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
                aria-hidden
              />

              <div className="relative flex items-start justify-between mb-5">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${m.gradient} shadow-lg ${m.glow} ring-1 ring-white/20`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 ring-1 ring-white/10 ${m.accent}`}
                  >
                    <Clock className="w-3 h-3" />
                    {m.duration}
                  </span>
                  <ArrowRight
                    className={`w-5 h-5 ${m.accent} opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0`}
                  />
                </div>
              </div>

              <p
                className={`relative text-xs font-medium uppercase tracking-wider ${m.accent} mb-1`}
              >
                {m.eyebrow}
              </p>
              <h3 className="relative text-xl font-semibold tracking-tight mb-2">
                {m.title}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed mb-4">
                {m.description}
              </p>
              <p className="relative text-[11px] text-muted-foreground/70">
                {m.questions}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
