"use client";

import { Menu } from "@base-ui/react/menu";
import { IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

interface UserMenuProps {
  user: {
    name: string;
    email?: string | null;
    image?: string | null;
  };
  onSignOut: () => void;
}

const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <Menu.Root>
      <Menu.Trigger
        render={(props) => (
          <Button
            type="button"
            variant="ghost"
            className="group min-h-11 gap-2 px-2"
            {...props}
          />
        )}
        aria-label="User menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={`${user.name}'s avatar`}
            className="size-6 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-semibold"
          >
            {initial}
          </span>
        )}
        <span className="text-foreground max-w-24 truncate text-sm font-medium">
          {user.name}
        </span>
        <IconChevronDown
          size={15}
          stroke={1.8}
          aria-hidden="true"
          className="text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          sideOffset={8}
          align="end"
          className="z-50 outline-none"
        >
          <Menu.Popup className="border-border bg-popover min-w-48 origin-[var(--transform-origin)] rounded-xl border p-1.5 transition-[scale,opacity] duration-100 ease-out outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="border-border/70 mb-1 border-b px-3 py-2">
              <p className="text-foreground truncate text-sm font-medium">
                {user.name}
              </p>
              {user.email ? (
                <p className="text-muted-foreground truncate text-xs">
                  {user.email}
                </p>
              ) : null}
            </div>

            <Menu.Item
              render={<Link to="/settings" />}
              className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring data-highlighted:bg-muted data-highlighted:text-foreground flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <IconSettings size={16} stroke={1.8} />
              Settings
            </Menu.Item>

            <div className="border-border/70 my-1 border-t" />

            <Menu.Item
              onClick={onSignOut}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-ring focus-visible:ring-destructive/50 data-highlighted:bg-destructive/10 data-highlighted:text-destructive flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <IconLogout size={16} stroke={1.8} />
              Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export { UserMenu };
