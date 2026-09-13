import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconLoader,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const useThemeMode = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const update = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useThemeMode();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        error: <IconAlertOctagon className="size-4" />,
        info: <IconInfoCircle className="size-4" />,
        loading: <IconLoader className="size-4 animate-spin" />,
        success: <IconCircleCheck className="size-4" />,
        warning: <IconAlertTriangle className="size-4" />,
      }}
      style={
        // SAFETY: All keys map to valid CSS custom properties defined in the theme.
        {
          "--border-radius": "var(--radius)",
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
