"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ margin: "0px 0px -48px 0px", once: true }}
        transition={{ delay, duration: 0.5, ease: EASE_OUT }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export { Reveal };
