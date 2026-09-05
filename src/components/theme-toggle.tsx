"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const THEME_STORAGE_KEY = "openvault-theme";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTheme(getInitialTheme());
      return;
    }
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="ease-smooth size-11 transition-transform duration-200 motion-reduce:transform-none motion-reduce:transition-none"
    >
      {isDark ? (
        <IconSun
          size={20}
          className="animate-in fade-in zoom-in-75 ease-smooth duration-200"
        />
      ) : (
        <IconMoon
          size={20}
          className="animate-in fade-in zoom-in-75 ease-smooth duration-200"
        />
      )}
    </Button>
  );
};

export { ThemeToggle };
