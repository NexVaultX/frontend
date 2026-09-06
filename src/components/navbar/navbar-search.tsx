import { IconSearch } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface NavbarSearchProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

const NavbarSearch = ({
  variant = "desktop",
  className,
}: NavbarSearchProps) => (
  <div className={cn("relative", variant === "mobile" && "mb-3", className)}>
    <IconSearch
      size={variant === "mobile" ? 18 : 17}
      stroke={1.8}
      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
    />
    <input
      type="search"
      aria-label="Search projects"
      placeholder="Search projects…"
      className={cn(
        "border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background rounded-lg border pr-3 pl-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        variant === "desktop" ? "h-10 w-56" : "h-11 w-full pl-10"
      )}
    />
  </div>
);

export { NavbarSearch };
