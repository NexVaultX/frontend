import { Elysia, t } from "elysia";

import {
  MOD_CATEGORIES,
  MOD_GAME_VERSIONS,
  MOD_LOADERS,
} from "../../src/lib/mods-data";
import type { Mod } from "../../src/lib/mods-data";
import { getSearchClient, MODS_INDEX } from "../lib/meilisearch";

const DEFAULT_SORT = "downloads:desc";
const SORTS = [DEFAULT_SORT, "updatedAt:desc", "name:asc"] as const;
const PAGE_SIZE = 12;
const MAX_PAGE = 1000;

const CATEGORIES = new Set<string>(MOD_CATEGORIES);
const GAME_VERSIONS = new Set<string>(MOD_GAME_VERSIONS);
const LOADERS = new Set<string>(MOD_LOADERS);

// Only values from the allowlists above ever reach the filter (see
// hasUnknownFilter), so they cannot contain quotes that would alter the
// Meilisearch filter expression.
const quote = (value: string) => `"${value}"`;

const isUnknown = (value: string | undefined, allowed: Set<string>) =>
  value !== undefined && !allowed.has(value);

const hasUnknownFilter = (params: {
  category?: string;
  gameVersion?: string;
  loader?: string;
}): boolean =>
  isUnknown(params.category, CATEGORIES) ||
  isUnknown(params.gameVersion, GAME_VERSIONS) ||
  isUnknown(params.loader, LOADERS);

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
  async ({ query, status }) => {
    if (hasUnknownFilter(query)) {
      return status(422, "Unknown filter value");
    }

    // SAFETY: SORTS is a readonly tuple of strings; widening to readonly
    // string[] is safe for the membership check below.
    const sort = (SORTS as readonly string[]).includes(query.sort ?? "")
      ? (query.sort ?? DEFAULT_SORT)
      : DEFAULT_SORT;

    const page = Math.max(1, query.page ?? 1);
    const offset = (page - 1) * PAGE_SIZE;

    const result = await getSearchClient()
      .index(MODS_INDEX)
      .search<Mod>(query.q ?? "", {
        facets: ["category", "gameVersions", "loaders"],
        filter: buildFilter(query),
        limit: PAGE_SIZE,
        offset,
        sort: [sort],
      });

    return {
      estimatedTotalHits: result.estimatedTotalHits,
      facetDistribution: result.facetDistribution,
      hits: result.hits,
      page,
      pageSize: PAGE_SIZE,
      query: result.query,
    };
  },
  {
    query: t.Object({
      q: t.Optional(t.String({ maxLength: 200 })),
      category: t.Optional(t.String()),
      gameVersion: t.Optional(t.String()),
      loader: t.Optional(t.String()),
      sort: t.Optional(t.String()),
      page: t.Optional(t.Integer({ minimum: 1, maximum: MAX_PAGE })),
    }),
  }
);
