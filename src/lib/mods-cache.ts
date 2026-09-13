import type { ModSearchParams, ModSearchResponse } from "@/lib/mods.functions";

export interface ModsCacheOptions {
  maxEntries?: number;
  ttlMs?: number;
}

export interface ModsCache {
  clear: () => void;
  delete: (params: ModSearchParams) => void;
  get: (params: ModSearchParams) => ModSearchResponse | undefined;
  set: (params: ModSearchParams, data: ModSearchResponse) => void;
}

interface ModsCacheEntry {
  data: ModSearchResponse;
  expiresAt: number;
}

const DEFAULT_MAX_ENTRIES = 50;
const DEFAULT_TTL_MS = 60_000;

const buildCacheKey = (params: ModSearchParams): string =>
  JSON.stringify([
    params.query,
    params.category ?? "",
    params.gameVersion ?? "",
    params.loader ?? "",
    params.sort,
  ]);

export const createModsCache = (options: ModsCacheOptions = {}): ModsCache => {
  const maxEntries = Math.max(1, options.maxEntries ?? DEFAULT_MAX_ENTRIES);
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const entries = new Map<string, ModsCacheEntry>();

  return {
    clear: () => {
      entries.clear();
    },
    delete: (params) => {
      entries.delete(buildCacheKey(params));
    },
    get: (params) => {
      const key = buildCacheKey(params);
      const entry = entries.get(key);

      if (!entry) {
        return;
      }

      if (entry.expiresAt <= Date.now()) {
        entries.delete(key);
        return;
      }

      // Refresh the LRU position: delete + re-insert moves the key to the tail.
      entries.delete(key);
      entries.set(key, entry);

      return entry.data;
    },
    set: (params, data) => {
      const key = buildCacheKey(params);

      if (entries.has(key)) {
        entries.delete(key);
      }

      // Evict the least-recently-used entry (the Map head) when at capacity.
      if (entries.size >= maxEntries) {
        const oldestKey = entries.keys().next().value;
        if (oldestKey !== undefined) {
          entries.delete(oldestKey);
        }
      }

      entries.set(key, { data, expiresAt: Date.now() + ttlMs });
    },
  };
};

export const modsCache = createModsCache();
