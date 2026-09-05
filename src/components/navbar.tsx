"use client";

import {
  IconChevronDown,
  IconMenu2,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import logo from "@/logo.png";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const CONTENT_LINKS = [
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="border-border/70 bg-background/85 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          aria-label="NexVaultX home"
          className="focus-visible:ring-ring flex min-h-11 shrink-0 items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <img src={logo} alt="NexVaultX" className="h-8 w-8 object-contain" />

          <span className="text-foreground text-lg font-semibold tracking-tight">
            NexVaultX
          </span>
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex"
        >
          <div className="group relative">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/70 focus-visible:ring-ring hover:border-border inline-flex min-h-10 items-center gap-1 rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
            >
              Content
              <IconChevronDown
                size={15}
                stroke={1.8}
                className="transition-transform duration-200 group-hover:rotate-180"
              />
            </button>

            {/* Content dropdown */}
            <div className="pointer-events-none invisible absolute top-full left-0 w-56 pt-2 opacity-0 transition-[opacity,transform,visibility] duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
              <div className="border-border bg-popover rounded-xl border p-1.5 shadow-xl">
                {CONTENT_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="relative hidden xl:block">
            <IconSearch
              size={17}
              stroke={1.8}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />

            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search projects…"
              className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background h-10 w-56 rounded-lg border pr-3 pl-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <ThemeToggle />

          <Button variant="default" size="sm" className="min-h-10 px-4">
            Sign In
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
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
            {menuOpen ? (
              <IconX size={21} stroke={1.8} />
            ) : (
              <IconMenu2 size={21} stroke={1.8} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-border/70 bg-background/95 animate-in fade-in slide-in-from-top-1 border-t backdrop-blur-xl duration-150 md:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* Mobile search */}
            <div className="relative mb-3">
              <IconSearch
                size={18}
                stroke={1.8}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />

              <input
                type="search"
                aria-label="Search projects"
                placeholder="Search projects…"
                className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background h-11 w-full rounded-lg border pr-3 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            {/* Content */}
            <div className="text-muted-foreground mb-2 px-3 py-2 text-xs font-semibold tracking-wider uppercase">
              Content
            </div>

            <nav aria-label="Content navigation" className="flex flex-col">
              {CONTENT_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <Button
              variant="default"
              size="sm"
              className="mt-3 min-h-11 w-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
