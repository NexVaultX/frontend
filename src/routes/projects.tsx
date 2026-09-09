import {
  IconBox,
  IconDeviceGamepad2,
  IconPackages,
  IconPalette,
  IconPhoto,
  IconServer,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

const PROJECT_SECTIONS = [
  {
    icon: IconBox,
    title: "Mods",
    description: "Enhance Minecraft with new features, mechanics, and content.",
    href: "/mods",
    available: true,
  },
  {
    icon: IconPackages,
    title: "Modpacks",
    description: "Curated collections of mods for every playstyle.",
    href: "/modpacks",
    available: false,
  },
  {
    icon: IconServer,
    title: "Plugins",
    description: "Extend your Minecraft server with powerful plugins.",
    href: "/plugins",
    available: false,
  },
  {
    icon: IconDeviceGamepad2,
    title: "Resource Packs",
    description: "Change the look and feel of your Minecraft experience.",
    href: "/resource-packs",
    available: false,
  },
  {
    icon: IconPalette,
    title: "Shaders",
    description: "Transform your world with stunning visual effects.",
    href: "/shaders",
    available: false,
  },
  {
    icon: IconPhoto,
    title: "Servers",
    description: "Find communities and worlds to explore with friends.",
    href: "/servers",
    available: false,
  },
] as const;

const cardClassName =
  "focus-visible:ring-ring group relative flex flex-col rounded-xl border bg-card p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none";

const ProjectsPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
    <header className="max-w-2xl">
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
        Projects
      </h1>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        Browse the NexVaultX catalog — mods, modpacks, resource packs, shaders,
        plugins, and servers made by the community.
      </p>
    </header>

    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECT_SECTIONS.map((section) => {
        const icon = <section.icon size={24} stroke={1.8} aria-hidden="true" />;

        return (
          <li key={section.href}>
            {section.available ? (
              <Link
                to={section.href}
                preload="intent"
                className={cn(cardClassName, "hover:bg-muted/50")}
              >
                <span className="text-primary">{icon}</span>
                <h2 className="text-foreground mt-4 text-lg font-semibold">
                  {section.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {section.description}
                </p>
                <span className="text-primary mt-4 text-sm font-medium">
                  Browse {section.title.toLowerCase()}
                </span>
              </Link>
            ) : (
              <div className="border-border bg-muted/30 flex flex-col rounded-xl border p-6">
                <span className="text-muted-foreground">{icon}</span>
                <h2 className="text-foreground mt-4 text-lg font-semibold">
                  {section.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {section.description}
                </p>
                <span className="text-muted-foreground mt-4 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                  Coming soon
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});
