"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getSessions,
  getWritingSessions,
  getSpeakingSessions,
  getGrammarSessions,
  getStreak,
  type PracticeSession,
} from "@/lib/storage";
import { aggregateErrors, type ErrorAggregation } from "@/lib/error-aggregation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PenTool,
  Mic,
  CheckSquare,
  Flame,
  TrendingUp,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSessions(getSessions());
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-9 w-56 bg-white/5 rounded-lg" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-white/5 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const writingSessions = getWritingSessions();
  const speakingSessions = getSpeakingSessions();
  const grammarSessions = getGrammarSessions();
  const streak = getStreak();

  // Chart data: writing band scores over time
  const chartData = writingSessions.map((s) => ({
    date: new Date(s.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    band: s.feedback.overall_band,
  }));

  // Cross-session grammar error aggregation (writing + speaking + grammar check)
  const errorAgg: ErrorAggregation = aggregateErrors(sessions);
  const topErrors: [string, number][] = errorAgg.byCategory
    .slice(0, 5)
    .map((c) => [c.category, c.count] as [string, number]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-orange-500/10 ring-1 ring-orange-400/20 text-xs font-medium text-orange-300">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              Your{" "}
              <span className="font-display italic text-[1.1em] bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text text-transparent">
                Progress
              </span>
            </h1>
            <p className="text-muted-foreground">
              Track your IELTS practice history and improvement.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: PenTool,
                value: writingSessions.length,
                label: "Writing Sessions",
                gradient: "from-violet-500 to-fuchsia-500",
                glow: "shadow-violet-500/20",
              },
              {
                icon: Mic,
                value: speakingSessions.length,
                label: "Speaking Sessions",
                gradient: "from-emerald-500 to-teal-500",
                glow: "shadow-emerald-500/20",
              },
              {
                icon: CheckSquare,
                value: grammarSessions.length,
                label: "Grammar Checks",
                gradient: "from-sky-500 to-indigo-500",
                glow: "shadow-sky-500/20",
              },
              {
                icon: Flame,
                value: streak,
                label: "Day Streak",
                gradient: "from-orange-500 to-rose-500",
                glow: "shadow-orange-500/20",
              },
            ].map(({ icon: Icon, value, label, gradient, glow }) => (
              <Card
                key={label}
                className="relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 ring-white/10"
              >
                <div
                  className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
                  aria-hidden
                />
                <CardContent className="pt-6 pb-5">
                  <div
                    className={`w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${glow} ring-1 ring-white/20 flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <Card className="mb-8 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-violet-400" />
                  Writing Band Score Trend
                </CardTitle>
                <CardDescription>
                  Your writing scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <XAxis
                        dataKey="date"
                        fontSize={11}
                        stroke="rgba(255,255,255,0.5)"
                      />
                      <YAxis
                        domain={[0, 9]}
                        ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        fontSize={11}
                        stroke="rgba(255,255,255,0.5)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(20,20,30,0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="band"
                        stroke="url(#bandGrad)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#c4b5fd" }}
                        name="Band Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-14 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  No writing sessions yet. Complete a writing practice to
                  see your score trend!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Grammar focus — cross-session aggregation with drill CTA */}
          {topErrors.length > 0 && (
            <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <div
                className="absolute -top-20 -right-16 w-60 h-60 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 blur-3xl pointer-events-none"
                aria-hidden
              />
              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      Grammar focus
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Your top recurring mistakes across all writing, speaking, and grammar-check sessions.
                    </CardDescription>
                  </div>
                  <Link href="/grammar/drills">
                    <Button size="sm">
                      Start drills
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  {topErrors.map(([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-2 bg-white/5 ring-1 ring-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                            style={{
                              width: `${(count / topErrors[0][1]) * 100}%`,
                            }}
                          />
                        </div>
                        <Badge variant="secondary" className="text-xs tabular-nums">
                          {count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {sessions.length === 0 && (
            <Card className="bg-card/60 backdrop-blur-xl ring-1 ring-white/10">
              <CardContent className="py-14 flex flex-col items-center gap-3">
                <p className="text-muted-foreground">
                  Start practicing to see your progress here!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
