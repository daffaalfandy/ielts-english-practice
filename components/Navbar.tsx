"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PenTool, Mic, CheckSquare, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/writing", label: "Writing", icon: PenTool },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/grammar", label: "Grammar", icon: CheckSquare },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </span>
            <span className="hidden sm:inline text-[15px] bg-gradient-to-r from-violet-200 to-sky-200 bg-clip-text text-transparent">
              IELTS Practice
            </span>
          </Link>

          <div className="flex items-center gap-0.5 p-1 rounded-full bg-white/5 ring-1 ring-white/10">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-violet-500/90 to-indigo-600/90 text-white shadow-md shadow-violet-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
