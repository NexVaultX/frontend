"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const SWAP_TRANSITION = { duration: 0.2, ease: "easeInOut" } as const;

interface IconSwapProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const IconSwap = ({ value, children, className }: IconSwapProps) => {
  const reduce = useReducedMotion();

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.25 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, transition: SWAP_TRANSITION }
          }
          exit={
            reduce
              ? undefined
              : { opacity: 0, scale: 0.25, transition: SWAP_TRANSITION }
          }
          className="col-start-1 row-start-1 inline-flex items-center justify-center"
        >
          {children}
        </m.span>
      </AnimatePresence>
    </span>
  );
};

export { IconSwap };
