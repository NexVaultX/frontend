import { Link, useMatchRoute } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

const CONTENT_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/mods", label: "Mods" },
] as const;

const linkClassName =
  "text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none";

const activeLinkClassName = "bg-muted text-foreground";

const NavbarLinks = () => {
  const matchRoute = useMatchRoute();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {CONTENT_LINKS.map((link) => {
        const isActive = !!matchRoute({ to: link.href });

        return (
          <Link
            key={link.href}
            to={link.href}
            preload="intent"
            aria-current={isActive ? "page" : undefined}
            className={cn(linkClassName, isActive && activeLinkClassName)}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export { CONTENT_LINKS, NavbarLinks };
