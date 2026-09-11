"use client";

import { IconX } from "@tabler/icons-react";
import { Link, useMatchRoute } from "@tanstack/react-router";

import { AuthButtons } from "@/components/navbar/auth-buttons";
import type { NavbarUser } from "@/components/navbar/auth-buttons";
import { CONTENT_LINKS } from "@/components/navbar/navbar-links";
import { NavbarSearch } from "@/components/navbar/navbar-search";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  isPending: boolean;
  session: { user: NavbarUser } | null | undefined;
  onSignOut: () => void;
}

const mobileLinkClassName =
  "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring min-h-11 flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none";

const NavbarMobileMenu = ({
  open,
  onClose,
  isPending,
  session,
  onSignOut,
}: NavbarMobileMenuProps) => {
  const matchRoute = useMatchRoute();

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      swipeDirection="right"
    >
      <DrawerContent id="mobile-menu" className="w-[85%] max-w-sm">
        <DrawerHeader className="flex-row items-center justify-between gap-2">
          <div className="min-w-0">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Navigate NexVaultX</DrawerDescription>
          </div>

          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Close menu"
                className="size-11 shrink-0"
              />
            }
          >
            <IconX size={21} stroke={1.8} />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <NavbarSearch variant="mobile" />

          <nav aria-label="Content navigation" className="flex flex-col">
            <p className="text-muted-foreground mb-2 px-3 py-2 text-xs font-semibold tracking-wider uppercase">
              Content
            </p>

            {CONTENT_LINKS.map((link) => {
              const isActive = !!matchRoute({ to: link.href });

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  preload="intent"
                  aria-current={isActive ? "page" : undefined}
                  onClick={onClose}
                  className={cn(
                    mobileLinkClassName,
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <AuthButtons
            variant="mobile"
            isPending={isPending}
            session={session}
            onSignOut={onSignOut}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { NavbarMobileMenu };
