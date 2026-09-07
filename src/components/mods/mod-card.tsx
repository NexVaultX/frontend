import { IconDownload, IconTag } from "@tabler/icons-react";

import type { Mod } from "@/lib/mods-data";

const formatDownloads = (count: number) => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return String(count);
};

const ModCard = ({ mod }: { mod: Mod }) => (
  <article className="group border-border bg-card focus-within:border-foreground/20 relative flex h-full flex-col rounded-2xl border p-5 transition-colors duration-300 focus-within:ring-1 motion-reduce:transition-none">
    <a
      href={`/mods/${mod.id}`}
      aria-label={`View ${mod.name}`}
      className="focus-visible:ring-ring absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="sr-only">View {mod.name}</span>
    </a>

    <div className="flex items-start gap-4">
      <div className="border-border bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold">
        {mod.name.charAt(0)}
      </div>

      <div className="min-w-0 pt-0.5">
        <span className="text-primary/80 border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
          {mod.category}
        </span>

        <h3 className="text-foreground mt-2 truncate text-base font-semibold">
          {mod.name}
        </h3>

        <p className="text-muted-foreground truncate text-xs">
          by {mod.author}
        </p>
      </div>
    </div>

    <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-6">
      {mod.description}
    </p>

    <div className="text-muted-foreground mt-auto flex items-center justify-between gap-4 pt-4 text-xs">
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5">
          <IconDownload size={14} />
          {formatDownloads(mod.downloads)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <IconTag size={14} />
          {mod.version}
        </span>
      </div>

      <span className="truncate">{mod.gameVersions[0]}</span>
    </div>
  </article>
);

export { ModCard };
