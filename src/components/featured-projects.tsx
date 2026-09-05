import { IconArrowUpRight, IconDownload, IconHeart } from "@tabler/icons-react";

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

const FeaturedProjects = () => (
  <section
    id="featured-projects"
    aria-labelledby="featured-projects-heading"
    className="px-4 py-16 sm:px-6 lg:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2
            id="featured-projects-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Featured Projects
          </h2>
          <p className="text-muted-foreground mt-2">
            Hand-picked projects loved by the community.
          </p>
        </div>
        <a
          href="/projects"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ease-smooth inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          View all
          <IconArrowUpRight size={16} />
        </a>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.name} delay={index * 60}>
            <article className="group border-border bg-card ease-smooth hover:shadow-soft relative h-full rounded-xl border p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <a
                href={`/project/${project.name.toLowerCase().replaceAll(" ", "-")}`}
                className="focus-visible:ring-ring absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`View ${project.name}`}
              >
                <span className="sr-only">View {project.name}</span>
              </a>

              <div className="flex items-start gap-4">
                <div
                  className="border-border bg-muted text-foreground flex size-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold"
                  aria-hidden="true"
                >
                  {project.initial}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{project.name}</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                    {project.category}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
                {project.description}
              </p>

              <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1">
                  <IconDownload size={14} />
                  {project.downloads}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconHeart size={14} />
                  {project.follows}
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export { FeaturedProjects };
