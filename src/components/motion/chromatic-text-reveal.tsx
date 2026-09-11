"use client";

import { useEffect, useState } from "react";

const CONTENT_TYPES = [
  "Minecraft",
  "Plugins",
  "Mods",
  "Datapacks",
  "Resource Packs",
  "Shaders",
] as const;

const CYCLE_INTERVAL_MS = 3000;
const EXIT_DURATION_MS = 250;

/** Chromatic aberration fringe built from the OKLCH semantic tokens. */
const CHROMATIC_SHADOW = {
  textShadow: "-2px 0 0 var(--primary), 2px 0 0 var(--secondary)",
} as const;

interface WordCycleHandlers {
  onExit: () => void;
  onSwap: () => void;
}

/** Runs an exit-then-swap cycle on a fixed cadence. Returns a cleanup. */
const scheduleWordCycle = ({ onExit, onSwap }: WordCycleHandlers) => {
  let exitTimer: ReturnType<typeof setTimeout> | undefined;
  let cycleTimer: ReturnType<typeof setTimeout> | undefined;

  const runCycle = () => {
    onExit();
    exitTimer = setTimeout(() => {
      onSwap();
      cycleTimer = setTimeout(runCycle, CYCLE_INTERVAL_MS);
    }, EXIT_DURATION_MS);
  };

  cycleTimer = setTimeout(runCycle, CYCLE_INTERVAL_MS);

  return () => {
    clearTimeout(exitTimer);
    clearTimeout(cycleTimer);
  };
};

const ChromaticTextReveal = () => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      return;
    }

    return scheduleWordCycle({
      onExit: () => setIsExiting(true),
      onSwap: () => {
        setIndex((current) => (current + 1) % CONTENT_TYPES.length);
        setIsExiting(false);
      },
    });
  }, []);

  const word = CONTENT_TYPES[index];

  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className="text-primary"
        style={CHROMATIC_SHADOW}
      >
        <span
          key={word}
          className={`inline-block ${
            isExiting ? "animate-word-exit" : "animate-word-enter"
          }`}
        >
          {word}
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {word}
      </span>
    </span>
  );
};

export { ChromaticTextReveal };
