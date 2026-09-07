"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ModCard } from "@/components/mods/mod-card";
import {
  MOD_CATEGORIES,
  MOD_GAME_VERSIONS,
  MOD_LOADERS,
} from "@/lib/mods-data";
import { searchMods } from "@/lib/mods.functions";
import type { ModSearchResponse } from "@/lib/mods.functions";

const SORT_OPTIONS = [
  { label: "Most downloaded", value: "downloads:desc" },
  { label: "Recently updated", value: "updatedAt:desc" },
  { label: "Name (A–Z)", value: "name:asc" },
] as const;

const selectClassName =
  "border-input bg-background text-foreground focus-visible:ring-ring min-h-11 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none";

const toErrorMessage = (cause: unknown) =>
  cause instanceof Error ? cause.message : "Could not search mods.";

const ModsPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [loader, setLoader] = useState("");
  const [sort, setSort] = useState("downloads:desc");
  const [result, setResult] = useState<ModSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(true);
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const data = await searchMods({
          data: {
            category,
            gameVersion,
            loader,
            query: debouncedQuery,
            sort,
          },
        });

        if (!cancelled) {
          setResult(data);
          setError(null);
          setIsSearching(false);
        }
      } catch (searchError) {
        if (!cancelled) {
          setError(toErrorMessage(searchError));
          setIsSearching(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [category, debouncedQuery, gameVersion, loader, sort]);

  const hasFilters = Boolean(category || gameVersion || loader || query);
  const showSkeletons = isSearching && !result && !error;
  const showEmpty =
    !isSearching && !error && result && result.hits.length === 0;
  const showResults =
    !isSearching && !error && result && result.hits.length > 0;

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setGameVersion("");
    setLoader("");
    setIsSearching(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Mods
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Discover performance, technology, adventure, and more — search
          thousands of Minecraft mods.
        </p>
      </header>

      <div className="relative mt-8">
        <IconSearch
          size={18}
          stroke={1.8}
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <label className="sr-only" htmlFor="mods-search">
          Search mods
        </label>
        <input
          id="mods-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search mods…"
          autoComplete="off"
          className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background min-h-12 w-full rounded-xl border pr-12 pl-11 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            <IconX size={16} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="sr-only" htmlFor="mods-category">
            Category
          </label>
          <select
            id="mods-category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setIsSearching(true);
            }}
            className={`${selectClassName} w-full`}
          >
            <option value="">All categories</option>
            {MOD_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="sr-only" htmlFor="mods-game-version">
            Game version
          </label>
          <select
            id="mods-game-version"
            value={gameVersion}
            onChange={(event) => {
              setGameVersion(event.target.value);
              setIsSearching(true);
            }}
            className={`${selectClassName} w-full`}
          >
            <option value="">All versions</option>
            {MOD_GAME_VERSIONS.map((value) => (
              <option key={value} value={value}>
                Minecraft {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="sr-only" htmlFor="mods-loader">
            Loader
          </label>
          <select
            id="mods-loader"
            value={loader}
            onChange={(event) => {
              setLoader(event.target.value);
              setIsSearching(true);
            }}
            className={`${selectClassName} w-full`}
          >
            <option value="">All loaders</option>
            {MOD_LOADERS.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="sr-only" htmlFor="mods-sort">
            Sort by
          </label>
          <select
            id="mods-sort"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setIsSearching(true);
            }}
            className={`${selectClassName} w-full`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-8 rounded-xl border px-4 py-3 text-sm"
        >
          {error}
        </div>
      ) : null}

      {showSkeletons ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="bg-muted h-52 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-foreground text-lg font-semibold">No mods found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try a different search or clear your filters.
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-primary focus-visible:ring-ring mt-4 min-h-10 rounded-lg px-3 text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      {showResults ? (
        <>
          <p className="text-muted-foreground mt-8 text-sm" aria-live="polite">
            {result.estimatedTotalHits}{" "}
            {result.estimatedTotalHits === 1 ? "mod" : "mods"} found
          </p>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.hits.map((mod) => (
              <li key={mod.id}>
                <ModCard mod={mod} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export const Route = createFileRoute("/mods")({
  component: ModsPage,
});
