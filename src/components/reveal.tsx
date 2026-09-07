"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import type { Target } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const HIDDEN = { opacity: 0, y: 12 } as const;
const VISIBLE = { opacity: 1, y: 0 } as const;

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -48px 0px", once: true });

  let animate: Target = HIDDEN;
  if (reduce || inView) {
    animate = VISIBLE;
  }

  return (
    <m.div
      ref={ref}
      initial={reduce ? false : HIDDEN}
      animate={animate}
      transition={
        reduce ? { duration: 0 } : { delay, duration: 0.5, ease: EASE_OUT }
      }
      className={cn(className)}
    >
      {children}
    </m.div>
  );
};

export { Reveal };
