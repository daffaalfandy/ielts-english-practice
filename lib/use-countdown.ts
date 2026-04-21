"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  /** When false, the clock pauses (remaining time is preserved). */
  isRunning?: boolean;
  /** Fires exactly once when the countdown reaches zero. */
  onExpire?: () => void;
}

interface UseCountdownResult {
  /** Whole seconds remaining, floored at 0. */
  remaining: number;
  /** True once the countdown has hit zero (latches). */
  expired: boolean;
  /** Restart the countdown with the current or a new duration. */
  restart: (newDurationSeconds?: number) => void;
}

/**
 * Wall-clock-anchored countdown. Safe in backgrounded tabs: we store an
 * absolute `endAt` timestamp and compute `remaining = endAt - now()` on every
 * tick, so drifted/throttled intervals self-correct instead of losing time.
 */
export function useCountdown(
  durationSeconds: number,
  { isRunning = true, onExpire }: UseCountdownOptions = {}
): UseCountdownResult {
  const [remaining, setRemaining] = useState(durationSeconds);

  // Latest onExpire, stable across renders, so callers may pass inline arrows
  // without causing re-firing.
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Absolute wall-clock deadline (ms) when running; null when paused.
  const endAtRef = useRef<number | null>(null);
  // Paused remaining seconds, used to resume.
  const pausedRemainingRef = useRef<number>(durationSeconds);
  // Ensures onExpire fires exactly once per countdown lifetime.
  const firedRef = useRef(false);

  const compute = useCallback(() => {
    if (endAtRef.current == null) {
      return pausedRemainingRef.current;
    }
    const ms = endAtRef.current - Date.now();
    return Math.max(0, Math.ceil(ms / 1000));
  }, []);

  const restart = useCallback(
    (newDurationSeconds?: number) => {
      const d = newDurationSeconds ?? durationSeconds;
      firedRef.current = false;
      pausedRemainingRef.current = d;
      endAtRef.current = isRunning ? Date.now() + d * 1000 : null;
      setRemaining(d);
    },
    [durationSeconds, isRunning]
  );

  // Reset when the configured duration changes (e.g. task switch).
  useEffect(() => {
    firedRef.current = false;
    pausedRemainingRef.current = durationSeconds;
    endAtRef.current = isRunning ? Date.now() + durationSeconds * 1000 : null;
    setRemaining(durationSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSeconds]);

  // Transition running ↔ paused without losing elapsed time.
  useEffect(() => {
    if (isRunning) {
      // Resume: anchor endAt from whatever remaining we had.
      endAtRef.current = Date.now() + pausedRemainingRef.current * 1000;
    } else {
      // Pause: freeze remaining.
      if (endAtRef.current != null) {
        pausedRemainingRef.current = Math.max(
          0,
          Math.ceil((endAtRef.current - Date.now()) / 1000)
        );
      }
      endAtRef.current = null;
      setRemaining(pausedRemainingRef.current);
    }
  }, [isRunning]);

  // Tick. 250ms chosen so that (a) returning from a backgrounded tab snaps
  // to the correct value within a frame, and (b) the 1Hz display updates
  // promptly without waiting up to a second.
  useEffect(() => {
    if (!isRunning) return;
    const iv = setInterval(() => {
      const next = compute();
      setRemaining((prev) => (prev === next ? prev : next));
    }, 250);
    return () => clearInterval(iv);
  }, [isRunning, compute]);

  // Fire onExpire once per lifetime when we cross zero.
  useEffect(() => {
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      onExpireRef.current?.();
    }
  }, [remaining]);

  return { remaining, expired: remaining === 0, restart };
}
