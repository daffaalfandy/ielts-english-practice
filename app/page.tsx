import Link from "next/link";
import {
  PenTool,
  Mic,
  CheckSquare,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const modules = [
  {
    title: "Writing Practice",
    description:
      "Practice IELTS Task 1 and Task 2 with AI-powered feedback on band scores, vocabulary, and grammar.",
    href: "/writing",
    icon: PenTool,
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/20",
    accent: "text-violet-300",
  },
  {
    title: "Speaking Practice",
    description:
      "Practice IELTS Part 2 speaking with cue cards, timed responses, and speech-to-text transcription.",
    href: "/speaking",
    icon: Mic,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    accent: "text-emerald-300",
  },
  {
    title: "Grammar Checker",
    description:
      "Paste any English text and get detailed grammar corrections with explanations of each rule.",
    href: "/grammar",
    icon: CheckSquare,
    gradient: "from-sky-500 to-indigo-500",
    glow: "shadow-sky-500/20",
    accent: "text-sky-300",
  },
  {
    title: "Progress Dashboard",
    description:
      "Track your practice history, view score trends, and monitor your improvement over time.",
    href: "/dashboard",
    icon: BarChart3,
    gradient: "from-orange-500 to-rose-500",
    glow: "shadow-orange-500/20",
    accent: "text-orange-300",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span className="text-xs font-medium text-muted-foreground">
                AI-powered IELTS preparation
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-5 leading-[1.02]">
              Master{" "}
              <span className="font-display italic text-[1.08em] bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                IELTS English
              </span>
              <br />
              with instant feedback
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sharpen your Writing, Speaking, and Grammar with intelligent,
              examiner-style feedback. Practice anytime, anywhere.
            </p>
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 p-6 sm:p-7 transition-all duration-300 hover:ring-white/20 hover:-translate-y-0.5 hover:bg-card/80"
                >
                  <div
                    className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${mod.gradient} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
                    aria-hidden
                  />

                  <div className="relative flex items-start justify-between mb-5">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} shadow-lg ${mod.glow} ring-1 ring-white/20`}
                    >
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 ${mod.accent} opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0`}
                    />
                  </div>

                  <h3 className="relative text-xl font-semibold tracking-tight mb-2">
                    {mod.title}
                  </h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
