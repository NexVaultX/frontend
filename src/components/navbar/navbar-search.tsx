import { IconSearch } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface NavbarSearchProps extends React.ComponentPropsWithRef<"input"> {
  variant?: "desktop" | "mobile";
}

const NavbarSearch = ({
  variant = "desktop",
  className,
  ref,
  ...props
}: NavbarSearchProps) => (
  <div
    className={cn("relative overflow-hidden", variant === "mobile" && "mb-3")}
  >
    <IconSearch
      size={variant === "mobile" ? 18 : 17}
      stroke={1.8}
      aria-hidden="true"
      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
    />
    <input
      ref={ref}
      type="search"
      aria-label="Search projects"
      placeholder="Search projects…"
      aria-keyshortcuts="Meta+k Control+k"
      {...props}
      className={cn(
        "border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background rounded-lg border pr-3 pl-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        variant === "desktop" ? "h-10 w-56" : "h-11 w-full pl-10",
        className
      )}
    />
    {variant === "desktop" ? (
      <kbd
        aria-hidden="true"
        className="border-border bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-none"
      >
        ⌘K
      </kbd>
    ) : null}
  </div>
);

export { NavbarSearch };
