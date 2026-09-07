import { createServerFn } from "@tanstack/react-start";

import { getSearchClient, MODS_INDEX } from "@/lib/meilisearch";
import {
  MOD_CATEGORIES,
  MOD_GAME_VERSIONS,
  MOD_LOADERS,
} from "@/lib/mods-data";
import type { Mod } from "@/lib/mods-data";

const CATEGORIES = new Set<string>(MOD_CATEGORIES);
const GAME_VERSIONS = new Set<string>(MOD_GAME_VERSIONS);
const LOADERS = new Set<string>(MOD_LOADERS);

const SORTS = ["downloads:desc", "updatedAt:desc", "name:asc"] as const;

export interface ModSearchParams {
  category?: string;
  gameVersion?: string;
  loader?: string;
  query: string;
  sort: string;
}

export interface ModSearchResponse {
  estimatedTotalHits: number;
  facetDistribution: Record<string, Record<string, number>> | undefined;
  hits: Mod[];
  query: string;
}

const quote = (value: string) => `"${value}"`;

const buildFilter = (params: ModSearchParams): string[] | undefined => {
  const filters: string[] = [];

  if (params.category && CATEGORIES.has(params.category)) {
    filters.push(`category = ${quote(params.category)}`);
  }

  if (params.gameVersion && GAME_VERSIONS.has(params.gameVersion)) {
    filters.push(`gameVersions = ${quote(params.gameVersion)}`);
  }

  if (params.loader && LOADERS.has(params.loader)) {
    filters.push(`loaders = ${quote(params.loader)}`);
  }

  return filters.length > 0 ? filters : undefined;
};

export const searchMods = createServerFn({ method: "GET" })
  .validator((data: ModSearchParams) => data)
  .handler(async ({ data }): Promise<ModSearchResponse> => {
    // SAFETY: SORTS is a readonly tuple of strings; widening to readonly
    // string[] is safe for the membership check below.
    const sort = (SORTS as readonly string[]).includes(data.sort)
      ? data.sort
      : "downloads:desc";

    const result = await getSearchClient()
      .index(MODS_INDEX)
      .search<Mod>(data.query, {
        facets: ["category", "gameVersions", "loaders"],
        filter: buildFilter(data),
        limit: 24,
        sort: [sort],
      });

    return {
      estimatedTotalHits: result.estimatedTotalHits,
      facetDistribution: result.facetDistribution,
      hits: result.hits,
      query: result.query,
    };
  });
