"use client";

import { IconArrowRight, IconDownload, IconHeart } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/reveal";

interface Project {
  name: string;
  description: string;
  category: string;
  downloads: string;
  follows: string;
  initial: string;
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
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const ProjectCard = ({ project }: { project: Project }) => (
  <article
    className="group border-border bg-card hover:border-foreground/20 relative h-full min-h-[205px] w-[calc(100vw-48px)] shrink-0 overflow-hidden rounded-xl border p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-lg sm:w-[360px]"
  >
    <a
      href={`/project/${project.name.toLowerCase().replaceAll(" ", "-")}`}
      className="focus-visible:ring-ring absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`View ${project.name}`}
    >
      <span className="sr-only">View {project.name}</span>
    </a>

    <div className="flex items-start gap-4">
      <div
        className="border-border bg-muted text-foreground flex size-14 shrink-0 items-center justify-center rounded-xl border text-xl font-bold transition-transform duration-200 group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        {project.initial}
      </div>

      <div className="min-w-0 pt-0.5">
        <h3 className="text-foreground truncate text-base font-semibold">
          {project.name}
        </h3>

        <p className="text-muted-foreground mt-1 text-xs font-medium">
          {project.category}
        </p>
      </div>
    </div>

    <p className="text-muted-foreground mt-5 line-clamp-2 text-sm leading-6">
      {project.description}
    </p>

    <div className="text-muted-foreground mt-5 flex items-center gap-5 text-xs">
      <span className="inline-flex items-center gap-1.5">
        <IconDownload size={14} />
        {project.downloads}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <IconHeart size={14} />
        {project.follows}
      </span>
    </div>

    <div
      aria-hidden="true"
      className="bg-foreground absolute right-5 bottom-0 left-5 h-px origin-left scale-x-0 opacity-0 transition-[transform,opacity] duration-200 group-hover:scale-x-100 group-hover:opacity-100"
    />
  </article>
);

const FeaturedProjects = () => {
  const [projects, setProjects] = useState(PROJECTS);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setProjects(shuffleProjects(PROJECTS));

    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const carouselProjects = [...projects, ...projects];

  const pauseForTouch = () => {
    document.documentElement.style.setProperty(
      "--NextVault-carousel-play-state",
      "paused"
    );

    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      document.documentElement.style.setProperty(
        "--NextVault-carousel-play-state",
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
        @keyframes NextVault-projects-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 8px));
          }
        }

        .NextVault-projects-track {
          animation: NextVault-projects-scroll 32s linear infinite;
          animation-play-state: var(--NextVault-carousel-play-state, running);
          will-change: transform;
        }

        .NextVault-projects:hover .NextVault-projects-track {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .NextVault-projects-track {
            animation-duration: 25s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .NextVault-projects-track {
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

        <div
          className="NextVault-projects -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          role="region"
          aria-label="Featured projects"
          onTouchStart={pauseForTouch}
        >
          <div className="NextVault-projects-track flex w-max gap-4">
            {carouselProjects.map((project, index) => (
              <Reveal
                key={`${project.name}-${index}`}
                delay={index < projects.length ? index * 40 : 0}
                className="shrink-0"
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>

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
