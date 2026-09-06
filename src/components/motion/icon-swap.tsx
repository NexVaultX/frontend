"use client";

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const BLUR_TRANSITION = { duration: 0.2, ease: "easeInOut" } as const;
const SWAP_BLUR = "blur(8px)";

interface IconSwapProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const IconSwap = ({ value, children, className }: IconSwapProps) => {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
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
            initial={
              reduce ? false : { filter: SWAP_BLUR, opacity: 0, scale: 0.25 }
            }
            animate={
              reduce
                ? { filter: "blur(0px)", opacity: 1, scale: 1 }
                : {
                    filter: "blur(0px)",
                    opacity: 1,
                    scale: 1,
                    transition: BLUR_TRANSITION,
                  }
            }
            exit={
              reduce
                ? undefined
                : {
                    filter: SWAP_BLUR,
                    opacity: 0,
                    scale: 0.25,
                    transition: BLUR_TRANSITION,
                  }
            }
            className="col-start-1 row-start-1 inline-flex items-center justify-center"
          >
            {children}
          </m.span>
        </AnimatePresence>
      </span>
    </LazyMotion>
  );
};

export { IconSwap };
