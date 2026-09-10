"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SPRING_SWAP } from "@/lib/ease";

const CONTENT_TYPES = [
  "Minecraft",
  "Plugins",
  "Mods",
  "Datapacks",
  "Resource Packs",
  "Shaders",
] as const;

const CYCLE_INTERVAL_MS = 3000;
const EXIT_DURATION_S = 0.2;

const HIDDEN = { opacity: 0, y: 12 } as const;
const VISIBLE = { opacity: 1, y: 0 } as const;

const EXIT_FADE = {
  opacity: 0,
  transition: { duration: EXIT_DURATION_S, ease: "easeIn" },
} as const;

/** Chromatic aberration fringe built from the OKLCH semantic tokens. */
const CHROMATIC_SHADOW = {
  textShadow: "-2px 0 0 var(--primary), 2px 0 0 var(--secondary)",
} as const;

const ChromaticTextReveal = () => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) {
      return;
    }
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % CONTENT_TYPES.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const word = CONTENT_TYPES[index];

  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className="text-primary"
        style={CHROMATIC_SHADOW}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={word}
            initial={reduce ? false : HIDDEN}
            animate={VISIBLE}
            exit={reduce ? undefined : EXIT_FADE}
            transition={SPRING_SWAP}
            className="inline-block"
          >
            {word}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {word}
      </span>
    </span>
  );
};

export { ChromaticTextReveal };
