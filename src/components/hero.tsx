import {
  IconArrowRight,
  IconBlocks,
  IconBox,
  IconDownload,
  IconLayersUnion,
  IconPalette,
  IconPuzzle,
  IconSearch,
  IconServer,
  IconSparkles,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { href: "/mods", icon: IconPuzzle, label: "Mods" },
  { href: "/resource-packs", icon: IconPalette, label: "Resource Packs" },
  { href: "/modpacks", icon: IconBlocks, label: "Modpacks" },
  { href: "/shaders", icon: IconLayersUnion, label: "Shaders" },
  { href: "/plugins", icon: IconBox, label: "Plugins" },
  { href: "/servers", icon: IconServer, label: "Servers" },
] as const;

const Hero = () => (
  <section className="page-enter px-4 pt-20 pb-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      <div className="border-border bg-muted/50 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
        <IconSparkles size={16} className="text-foreground" />
        Open source · Free forever
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        Discover the best <span className="text-foreground">
          Minecraft
        </span>{" "}
        mods, packs &amp; plugins
      </h1>

      <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
        The free, open-source platform for discovering, managing, and sharing
        Minecraft content. No ads, no tracking, no paywalls — just great
        projects from a community that cares.
      </p>

      <div className="relative mx-auto mb-8 max-w-2xl">
        <IconSearch
          size={20}
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <input
          type="search"
          aria-label="Search projects"
          placeholder="Search for mods, shaders, resource packs…"
          className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring ease-smooth h-14 w-full rounded-xl border pr-32 pl-12 text-base shadow-lg transition-shadow duration-200 focus-visible:ring-2 focus-visible:outline-none"
        />
        <Button
          variant="default"
          size="sm"
          className="absolute top-1/2 right-2 min-h-11 -translate-y-1/2"
        >
          Search
        </Button>
      </div>

      <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="default"
          size="lg"
          className="ease-smooth hover:shadow-soft min-h-11 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
        >
          Browse Projects
          <IconArrowRight size={16} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="ease-smooth hover:shadow-soft min-h-11 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
        >
          <IconDownload size={16} />
          Get the Launcher
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => (
          <a
            key={category.href}
            href={category.href}
            className="border-border bg-card text-muted-foreground hover:border-border hover:text-foreground focus-visible:ring-ring ease-smooth hover:shadow-soft inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none"
          >
            <category.icon size={16} />
            {category.label}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export { Hero };
