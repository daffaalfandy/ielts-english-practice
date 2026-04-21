"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TimeUpWarningProps {
  title: string;
  message: string;
  /** Render the banner at all. Caller controls dismissal. */
  open: boolean;
  onDismiss?: () => void;
  /** Play a short attention cue when the banner opens. Defaults to true. */
  playCue?: boolean;
}

// Short, audio-file-free attention cue via Web Audio. Silently no-ops when
// the AudioContext is unavailable or the tab has never been interacted with.
function playAttentionCue() {
  if (typeof window === "undefined") return;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return;
  try {
    const ctx = new Ctx();
    const beep = (freq: number, startOffset: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
      gain.gain.linearRampToValueAtTime(
        0.15,
        ctx.currentTime + startOffset + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startOffset + duration
      );
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration + 0.05);
    };
    beep(880, 0, 0.18);
    beep(660, 0.22, 0.22);
    setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    // ignore
  }
}

export function TimeUpWarning({
  title,
  message,
  open,
  onDismiss,
  playCue = true,
}: TimeUpWarningProps) {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      openedRef.current = false;
      return;
    }
    if (openedRef.current) return;
    openedRef.current = true;
    if (playCue) playAttentionCue();
    // Don't steal focus from an actively-edited field (e.g. the writing
    // textarea). aria-live="assertive" on the banner is enough for screen
    // readers; sighted users see the sticky banner at the top.
    const active = document.activeElement;
    const editing =
      active instanceof HTMLElement &&
      (active.tagName === "TEXTAREA" ||
        active.tagName === "INPUT" ||
        active.isContentEditable);
    if (!editing) bannerRef.current?.focus();
  }, [open, playCue]);

  if (!open) return null;

  return (
    <Card
      ref={bannerRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className="sticky top-4 z-20 mb-6 bg-amber-500/10 backdrop-blur-xl ring-1 ring-amber-400/40 outline-none"
    >
      <CardContent className="py-4 flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
          aria-hidden
        />
        <div className="text-sm flex-1">
          <p className="font-medium text-amber-300">{title}</p>
          <p className="text-muted-foreground mt-1">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss warning"
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
