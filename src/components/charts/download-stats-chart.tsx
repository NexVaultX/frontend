import { barY, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart } from "@tanstack/react-charts";
import { useMemo } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface DownloadStat {
  downloads: number;
  month: string;
}

const MOCK_DOWNLOAD_STATS = [
  { downloads: 1240, month: "Apr" },
  { downloads: 1890, month: "May" },
  { downloads: 1520, month: "Jun" },
  { downloads: 2310, month: "Jul" },
  { downloads: 2980, month: "Aug" },
  { downloads: 3420, month: "Sep" },
] as const satisfies readonly DownloadStat[];

const compactFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  notation: "compact",
});

interface DownloadStatsChartProps {
  data?: readonly DownloadStat[];
}

const summarizeDownloads = ([
  first,
  ...rest
]: readonly DownloadStat[]): string => {
  if (!first) {
    return "No download data available.";
  }

  let total = first.downloads;
  let peak = first;

  for (const stat of rest) {
    total += stat.downloads;
    if (stat.downloads > peak.downloads) {
      peak = stat;
    }
  }

  const months = 1 + rest.length;
  return `${months} months of download data. ${total.toLocaleString()} total downloads, peaking in ${peak.month} with ${peak.downloads.toLocaleString()} downloads.`;
};

const DownloadStatsChart = ({
  data = MOCK_DOWNLOAD_STATS,
}: DownloadStatsChartProps) => {
  const reduce = usePrefersReducedMotion();

  // oxlint-disable-next-line react-doctor/react-compiler-no-manual-memoization -- React Compiler is not enabled in this project; the chart definition must be memoized so TanStack Charts rebuilds the scene only when data or motion preference changes
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          barY(data, {
            fill: "var(--primary)",
            radius: 3,
            x: "month",
            y: "downloads",
          }),
        ],
        scales: {
          x: {
            scale: () => scaleBand().padding(0.3),
          },
          y: {
            axis: {
              label: "Downloads",
              ticks: { format: (value) => compactFormatter.format(value) },
            },
            grid: true,
            nice: true,
            scale: scaleLinear,
          },
        },
        svgAnimation: reduce
          ? false
          : { duration: 400, easing: "ease-out", respectReducedMotion: true },
        theme: {
          background: "transparent",
          foreground: "var(--foreground)",
          grid: "var(--border)",
          muted: "var(--muted-foreground)",
          palette: ["var(--primary)", "var(--secondary)", "var(--accent)"],
        },
        tooltip,
      }),
    [data, reduce]
  );

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No download data available.
      </p>
    );
  }

  const summary = summarizeDownloads(data);

  return (
    <figure className="w-full min-w-0">
      <Chart
        definition={definition}
        height={280}
        tabIndex={0}
        ariaLabel="Download statistics by month"
        className="w-full"
      />
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
};

export { DownloadStatsChart };
export type { DownloadStat };
