"use client";

import { IconArrowRight, IconDownload, IconHeart } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";

interface Project {
  category: string;
  description: string;
  downloads: string;
  follows: string;
  initial: string;
  name: string;
}

const PROJECTS: Project[] = [
  {
    category: "Performance",
    description:
      "Optimize your Minecraft experience with advanced rendering and CPU improvements.",
    downloads: "14.2M",
    follows: "98.5K",
    initial: "S",
    name: "Spark Performance",
  },
  {
    category: "Technology",
    description:
      "Build intricate mechanical systems and automated factories in survival.",
    downloads: "9.8M",
    follows: "72.1K",
    initial: "C",
    name: "Create Dreams",
  },
  {
    category: "Exploration",
    description:
      "Mark locations, share trails, and never get lost in your world again.",
    downloads: "7.3M",
    follows: "54.8K",
    initial: "F",
    name: "Fabric Waypoints",
  },
  {
    category: "Shaders",
    description:
      "Stunning visual effects with realistic lighting, shadows, and water.",
    downloads: "11.6M",
    follows: "83.2K",
    initial: "P",
    name: "Prism Shaders",
  },
  {
    category: "Performance",
    description:
      "Server-side optimization for smoother multiplayer and reduced lag.",
    downloads: "6.1M",
    follows: "41.7K",
    initial: "L",
    name: "Lithium Core",
  },
  {
    category: "Utility",
    description: "Real-time minimap and full-screen map with waypoint support.",
    downloads: "8.9M",
    follows: "63.4K",
    initial: "J",
    name: "Journey Maps",
  },
];

const carouselProjects = [...PROJECTS, ...PROJECTS].map((project, index) => ({
  carouselKey: `${project.name}-${index}`,
  project,
}));

const MarqueeTrack = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden">
    <div className="animate-marquee flex w-max gap-4">{children}</div>
  </div>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <article className="marquee-card group border-border bg-card focus-within:border-foreground/20 relative flex h-full min-h-[240px] w-[calc(100vw-48px)] shrink-0 flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300 focus-within:ring-1 motion-reduce:transition-none sm:w-[360px]">
    <a
      href={`/project/${project.name.toLowerCase().replaceAll(" ", "-")}`}
      className="focus-visible:ring-ring absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`View ${project.name}`}
    >
      <span className="sr-only">View {project.name}</span>
    </a>

    <div className="flex items-start gap-4">
      <div className="border-border bg-primary/10 text-primary group-focus-within:bg-primary/15 flex size-14 shrink-0 items-center justify-center rounded-xl border text-xl font-bold transition-[transform,background-color,border-color] duration-300 group-focus-within:scale-105">
        {project.initial}
      </div>

      <div className="min-w-0 pt-0.5">
        <span className="text-primary/80 border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
          {project.category}
        </span>

        <h3 className="text-foreground mt-2 truncate text-base font-semibold">
          {project.name}
        </h3>
      </div>
    </div>

    <p className="text-muted-foreground mt-4 line-clamp-2 text-sm leading-6">
      {project.description}
    </p>

    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
      <div className="text-muted-foreground flex items-center gap-5 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <IconDownload size={14} aria-hidden="true" />
          {project.downloads}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <IconHeart size={14} aria-hidden="true" />
          {project.follows}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="text-primary inline-flex translate-x-1 items-center gap-1 text-xs font-semibold opacity-0 transition-[transform,opacity] duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100"
      >
        View
        <IconArrowRight size={14} />
      </span>
    </div>
  </article>
);

const FeaturedProjects = () => (
  <section
    id="featured-projects"
    aria-labelledby="featured-projects-heading"
    className="overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <Reveal className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            Community favorites
          </p>

          <h2
            id="featured-projects-heading"
            className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Featured Projects
          </h2>

          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Popular projects worth checking out.
          </p>
        </div>

        <a
          href="/projects"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring group hidden min-h-11 shrink-0 items-center gap-1 rounded-md text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
        >
          View all
          <IconArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>
      </Reveal>

      <MarqueeTrack>
        {carouselProjects.map(({ project, carouselKey }) => (
          <ProjectCard key={carouselKey} project={project} />
        ))}
      </MarqueeTrack>

      <div className="mt-4 flex justify-center sm:hidden">
        <a
          href="/projects"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          View all projects
          <IconArrowRight size={15} />
        </a>
      </div>
    </div>
  </section>
);

export { FeaturedProjects };
