import { cn } from "cn";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "bg-muted animate-pulse rounded-lg motion-reduce:animate-none",
      className
    )}
    {...props}
  />
);

export { Skeleton };
