import { Link, useMatchRoute } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

const CONTENT_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/mods", label: "Mods" },
  { href: "/resource-packs", label: "Resource Packs" },
  { href: "/modpacks", label: "Modpacks" },
  { href: "/shaders", label: "Shaders" },
  { href: "/plugins", label: "Plugins" },
  { href: "/servers", label: "Servers" },
] as const;

const linkClassName =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring group relative inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none";

const activeIndicatorClassName =
  "bg-foreground absolute inset-x-3 -bottom-0.5 h-px transition-[transform,opacity] duration-200";

const inactiveIndicatorClassName =
  "origin-left scale-x-[0.01] opacity-0 group-hover:scale-x-100 group-hover:opacity-100";

const NavbarLinks = () => {
  const matchRoute = useMatchRoute();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {CONTENT_LINKS.map((link) => {
        const isActive =
          link.href === "/mods" || link.href === "/projects"
            ? !!matchRoute({ to: link.href })
            : false;

        if (link.href === "/mods" || link.href === "/projects") {
          return (
            <Link
              key={link.href}
              to={link.href}
              preload="intent"
              activeProps={{
                "aria-current": "page",
                className: cn(linkClassName, "text-foreground"),
              }}
              className={linkClassName}
            >
              {link.label}

              <span
                aria-hidden="true"
                className={cn(
                  activeIndicatorClassName,
                  isActive
                    ? "scale-x-100 opacity-100"
                    : inactiveIndicatorClassName
                )}
              />
            </Link>
          );
        }

        return (
          <a key={link.href} href={link.href} className={linkClassName}>
            {link.label}

            <span
              aria-hidden="true"
              className="bg-foreground absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-[0.01] opacity-0 transition-[transform,opacity] duration-200 group-hover:scale-x-100 group-hover:opacity-100"
            />
          </a>
        );
      })}
    </nav>
  );
};

export { CONTENT_LINKS, NavbarLinks };
