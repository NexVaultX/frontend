"use client";

import { IconBox, IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/mods", label: "Mods" },
  { href: "/resource-packs", label: "Resource Packs" },
  { href: "/modpacks", label: "Modpacks" },
  { href: "/shaders", label: "Shaders" },
  { href: "/plugins", label: "Plugins" },
  { href: "/servers", label: "Servers" },
] as const;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="focus-visible:ring-ring flex min-h-11 shrink-0 items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <IconBox size={24} className="text-foreground" />
          <span className="text-lg font-semibold tracking-tight">
            OpenVault
          </span>
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex md:flex-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring after:bg-foreground ease-smooth after:ease-smooth relative inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-[0.01] after:opacity-0 after:transition-[transform,opacity] after:duration-300 hover:after:scale-x-100 hover:after:opacity-100 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:after:transition-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <div className="relative">
            <IconSearch
              size={18}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search projects…"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-56 rounded-lg border pr-3 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <ThemeToggle />
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="size-11"
          >
            {menuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="border-border bg-background/95 animate-in fade-in slide-in-from-top-2 ease-smooth border-t backdrop-blur duration-200 lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <div className="relative mb-3">
              <IconSearch
                size={18}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                type="search"
                aria-label="Search projects"
                placeholder="Search projects…"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-lg border pr-3 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring ease-smooth rounded-md px-3 py-3 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <Button
              variant="default"
              size="sm"
              className="mt-2 min-h-11 w-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export { Navbar };
