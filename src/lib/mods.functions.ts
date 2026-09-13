import { createServerFn } from "@tanstack/react-start";

import {
  MOD_CATEGORIES,
  MOD_GAME_VERSIONS,
  MOD_LOADERS,
} from "@/lib/mods-data";
import type { Mod } from "@/lib/mods-data";

import env from "../../env.config";

const CATEGORIES = new Set<string>(MOD_CATEGORIES);
const GAME_VERSIONS = new Set<string>(MOD_GAME_VERSIONS);
const LOADERS = new Set<string>(MOD_LOADERS);

const SORTS = ["downloads:desc", "updatedAt:desc", "name:asc"] as const;

export interface ModSearchParams {
  category?: string;
  gameVersion?: string;
  loader?: string;
  page?: number;
  query: string;
  sort: string;
}

export interface ModSearchResponse {
  estimatedTotalHits: number;
  facetDistribution: Record<string, Record<string, number>> | undefined;
  hits: Mod[];
  page: number;
  pageSize: number;
  query: string;
}

export const searchMods = createServerFn({ method: "GET" })
  .validator((data: ModSearchParams) => data)
  .handler(async ({ data }): Promise<ModSearchResponse> => {
    const params = new URLSearchParams();

    if (data.query) {
      params.set("q", data.query);
    }
    if (data.category && CATEGORIES.has(data.category)) {
      params.set("category", data.category);
    }
    if (data.gameVersion && GAME_VERSIONS.has(data.gameVersion)) {
      params.set("gameVersion", data.gameVersion);
    }
    if (data.loader && LOADERS.has(data.loader)) {
      params.set("loader", data.loader);
    }
    if (data.page && data.page > 1) {
      params.set("page", String(data.page));
    }
    // SAFETY: SORTS is a readonly tuple of strings; widening to readonly
    // string[] is safe for the membership check below.
    params.set(
      "sort",
      (SORTS as readonly string[]).includes(data.sort)
        ? data.sort
        : "downloads:desc"
    );

    let response: Response;
    try {
      response = await fetch(
        `${env.API_URL}/api/mods/search?${params.toString()}`,
        { signal: AbortSignal.timeout(8000) }
      );
    } catch (fetchError) {
      throw new Error(
        "Could not reach the search service. Start the API server with `pnpm dev:all` and try again.",
        { cause: fetchError }
      );
    }

    if (!response.ok) {
      throw new Error(`Search failed (${response.status})`);
    }

    // SAFETY: The Elysia /api/mods/search endpoint returns the same shape as
    // the previous direct Meilisearch call (hits + estimatedTotalHits + query).
    return response.json() as Promise<ModSearchResponse>;
  });
