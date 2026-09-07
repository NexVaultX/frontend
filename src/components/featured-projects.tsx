"use client";

import { IconArrowRight, IconDownload, IconHeart } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

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

const shuffleProjects = (projects: Project[]) => {
  const shuffled = [...projects];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    // oxlint-disable-next-line sonarjs/pseudo-random -- Fisher-Yates shuffle for mock carousel data
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const ProjectCard = ({ project }: { project: Project }) => (
  <article className="group NexVaultX-projects-card border-border bg-card hover:border-foreground/20 focus-within:border-foreground/20 ease-smooth hover:ring-ring/25 focus-within:ring-ring/25 relative flex h-full min-h-[240px] w-[calc(100vw-48px)] shrink-0 flex-col overflow-hidden rounded-2xl border p-6 transition-[transform,box-shadow,border-color,opacity] duration-300 focus-within:-translate-y-1.5 focus-within:scale-[1.02] focus-within:shadow-lg focus-within:ring-1 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-lg hover:ring-1 motion-reduce:transform-none motion-reduce:transition-none sm:w-[360px]">
    <a
      href={`/project/${project.name.toLowerCase().replaceAll(" ", "-")}`}
      className="focus-visible:ring-ring absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`View ${project.name}`}
    >
      <span className="sr-only">View {project.name}</span>
    </a>

    <div
      aria-hidden="true"
      className="via-foreground/15 absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
    />

    <div className="flex items-start gap-4">
      <div
        className="border-border bg-muted text-foreground group-hover:border-foreground/20 group-hover:bg-muted/70 group-focus-within:border-foreground/20 group-focus-within:bg-muted/70 flex size-14 shrink-0 items-center justify-center rounded-xl border text-xl font-bold transition-[transform,background-color,border-color] duration-300 group-focus-within:scale-105 group-hover:scale-105"
        aria-hidden="true"
      >
        {project.initial}
      </div>

      <div className="min-w-0 pt-0.5">
        <span className="text-muted-foreground border-border bg-muted/50 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
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
          <IconDownload size={14} />
          {project.downloads}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <IconHeart size={14} />
          {project.follows}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="text-foreground inline-flex translate-x-1 items-center gap-1 text-xs font-semibold opacity-0 transition-[transform,opacity] duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
      >
        View
        <IconArrowRight size={14} />
      </span>
    </div>
  </article>
);

const FeaturedProjects = () => {
  const [projects, setProjects] = useState(PROJECTS);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Shuffle must run post-hydration to avoid SSR/client mismatch from Math.random()
    setProjects(shuffleProjects(PROJECTS));

    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const carouselProjects = [...projects, ...projects].map((project, index) => ({
    carouselKey: `${project.name}-${index}`,
    delay: index < projects.length ? index * 40 : 0,
    project,
  }));

  const pauseForTouch = () => {
    document.documentElement.style.setProperty(
      "--NexVaultX-carousel-play-state",
      "paused"
    );

    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      document.documentElement.style.setProperty(
        "--NexVaultX-carousel-play-state",
        "running"
      );
    }, 2500);
  };

  return (
    <section
      id="featured-projects"
      aria-labelledby="featured-projects-heading"
      className="overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <style>{`
        @keyframes NexVaultX-projects-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 8px));
          }
        }

        .NexVaultX-projects-track {
          animation: NexVaultX-projects-scroll 32s linear infinite;
          animation-play-state: var(--NexVaultX-carousel-play-state, running);
          will-change: transform;
        }

        .NexVaultX-projects:hover .NexVaultX-projects-track {
          animation-play-state: paused;
        }

        @media (hover: hover) {
          .NexVaultX-projects:has(.NexVaultX-projects-card:hover)
            .NexVaultX-projects-card:not(:hover) {
            opacity: 0.65;
          }
        }

        @media (max-width: 640px) {
          .NexVaultX-projects-track {
            animation-duration: 25s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .NexVaultX-projects-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>

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

        <section
          className="NexVaultX-projects -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          aria-label="Featured projects"
          onTouchStart={pauseForTouch}
        >
          <div className="NexVaultX-projects-track flex w-max gap-4">
            {carouselProjects.map(({ project, carouselKey, delay }) => (
              <Reveal key={carouselKey} delay={delay} className="shrink-0">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>

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
};

export { FeaturedProjects };
