import { Elysia, t } from "elysia";

import type { Mod } from "../../src/lib/mods-data";
import { getSearchClient, MODS_INDEX } from "../lib/meilisearch";

const DEFAULT_SORT = "downloads:desc";
const SORTS = [DEFAULT_SORT, "updatedAt:desc", "name:asc"] as const;

const quote = (value: string) => `"${value}"`;

const buildFilter = (params: {
  category?: string;
  gameVersion?: string;
  loader?: string;
}): string[] | undefined => {
  const filters: string[] = [];

  if (params.category) {
    filters.push(`category = ${quote(params.category)}`);
  }
  if (params.gameVersion) {
    filters.push(`gameVersions = ${quote(params.gameVersion)}`);
  }
  if (params.loader) {
    filters.push(`loaders = ${quote(params.loader)}`);
  }

  return filters.length > 0 ? filters : undefined;
};

export const modsRoute = new Elysia().get(
  "/api/mods/search",
  async ({ query }) => {
    // SAFETY: SORTS is a readonly tuple of strings; widening to readonly
    // string[] is safe for the membership check below.
    const sort = (SORTS as readonly string[]).includes(query.sort ?? "")
      ? (query.sort ?? DEFAULT_SORT)
      : DEFAULT_SORT;

    const result = await getSearchClient()
      .index(MODS_INDEX)
      .search<Mod>(query.q ?? "", {
        facets: ["category", "gameVersions", "loaders"],
        filter: buildFilter(query),
        limit: 24,
        sort: [sort],
      });

    return {
      estimatedTotalHits: result.estimatedTotalHits,
      facetDistribution: result.facetDistribution,
      hits: result.hits,
      query: result.query,
    };
  },
  {
    query: t.Object({
      q: t.Optional(t.String()),
      category: t.Optional(t.String()),
      gameVersion: t.Optional(t.String()),
      loader: t.Optional(t.String()),
      sort: t.Optional(t.String()),
    }),
  }
);
