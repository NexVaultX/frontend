import { cn } from "cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

const Spinner = ({ className, label = "Loading" }: SpinnerProps) => (
  <output
    aria-busy="true"
    aria-label={label}
    className={cn(
      "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none",
      className
    )}
  />
);

export { Spinner };
