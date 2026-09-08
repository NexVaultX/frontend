import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createModsCache } from "@/lib/mods-cache";
import type { ModSearchResponse } from "@/lib/mods.functions";

const responseFixture = (query: string): ModSearchResponse => ({
  estimatedTotalHits: 1,
  // oxlint-disable-next-line sonarjs/no-undefined-assignment -- Test fixture mirrors the server response shape
  facetDistribution: undefined,
  hits: [],
  query,
});

describe(createModsCache, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined for a missing key", () => {
    const cache = createModsCache();

    expect(
      cache.get({ query: "sodium", sort: "downloads:desc" })
    ).toBeUndefined();
  });

  it("stores and returns a value for the same params", () => {
    const cache = createModsCache();
    const params = { query: "sodium", sort: "downloads:desc" };

    cache.set(params, responseFixture("sodium"));

    expect(cache.get(params)?.query).toBe("sodium");
  });

  it("treats different filter combinations as distinct keys", () => {
    const cache = createModsCache();
    const base = { query: "sodium", sort: "downloads:desc" };

    cache.set(base, responseFixture("sodium"));
    cache.set({ ...base, category: "performance" }, responseFixture("sodium"));

    expect(cache.get(base)?.query).toBe("sodium");
    expect(cache.get({ ...base, category: "performance" })?.query).toBe(
      "sodium"
    );
    expect(cache.get({ ...base, category: "technology" })).toBeUndefined();
  });

  it("expires entries after the TTL", () => {
    const cache = createModsCache({ ttlMs: 1000 });
    const params = { query: "sodium", sort: "downloads:desc" };

    cache.set(params, responseFixture("sodium"));

    vi.advanceTimersByTime(999);
    expect(cache.get(params)).toBeDefined();

    vi.advanceTimersByTime(2);
    expect(cache.get(params)).toBeUndefined();
  });

  it("evicts the least-recently-used entry when at capacity", () => {
    const cache = createModsCache({ maxEntries: 2 });

    cache.set({ query: "a", sort: "downloads:desc" }, responseFixture("a"));
    cache.set({ query: "b", sort: "downloads:desc" }, responseFixture("b"));

    // Touch "a" so "b" becomes the LRU entry.
    cache.get({ query: "a", sort: "downloads:desc" });

    cache.set({ query: "c", sort: "downloads:desc" }, responseFixture("c"));

    expect(cache.get({ query: "a", sort: "downloads:desc" })).toBeDefined();
    expect(cache.get({ query: "b", sort: "downloads:desc" })).toBeUndefined();
    expect(cache.get({ query: "c", sort: "downloads:desc" })).toBeDefined();
  });

  it("delete removes a single entry", () => {
    const cache = createModsCache();
    const params = { query: "sodium", sort: "downloads:desc" };

    cache.set(params, responseFixture("sodium"));
    cache.delete(params);

    expect(cache.get(params)).toBeUndefined();
  });

  it("delete only removes the matching entry", () => {
    const cache = createModsCache();
    const base = { query: "sodium", sort: "downloads:desc" };

    cache.set(base, responseFixture("sodium"));
    cache.set({ ...base, category: "performance" }, responseFixture("sodium"));

    cache.delete(base);

    expect(cache.get(base)).toBeUndefined();
    expect(cache.get({ ...base, category: "performance" })).toBeDefined();
  });

  it("clear removes all entries", () => {
    const cache = createModsCache();
    const params = { query: "sodium", sort: "downloads:desc" };

    cache.set(params, responseFixture("sodium"));
    cache.clear();

    expect(cache.get(params)).toBeUndefined();
  });
});
