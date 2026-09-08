"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { ModCard } from "@/components/mods/mod-card";
import { Skeleton } from "@/components/ui/skeleton";
import { modsCache } from "@/lib/mods-cache";
import {
  MOD_CATEGORIES,
  MOD_GAME_VERSIONS,
  MOD_LOADERS,
} from "@/lib/mods-data";
import { searchMods } from "@/lib/mods.functions";
import type { ModSearchParams, ModSearchResponse } from "@/lib/mods.functions";

const DEFAULT_SORT = "downloads:desc";

// SAFETY: Vite exposes VITE_* vars as `any`; narrowing to string | undefined
// matches the runtime value (string when set, undefined when absent).
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3002";

interface LiveModEventData {
  id: string;
  name: string;
}

interface LiveModEvent {
  event: "mod.created" | "mod.updated" | "mod.deleted";
  data: LiveModEventData;
}

const LIVE_EVENT_LABELS = {
  "mod.created": "New mod added",
  "mod.updated": "Mod updated",
  "mod.deleted": "Mod removed",
} as const satisfies Record<LiveModEvent["event"], string>;

const SORT_OPTIONS = [
  { label: "Most downloaded", value: DEFAULT_SORT },
  { label: "Recently updated", value: "updatedAt:desc" },
  { label: "Name (A–Z)", value: "name:asc" },
] as const;

const selectClassName =
  "border-input bg-background text-foreground focus-visible:ring-ring min-h-11 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none";

const toErrorMessage = (cause: unknown) =>
  cause instanceof Error ? cause.message : "Could not search mods.";

const ModsSearchBar = ({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) => (
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
      onChange={(event) => onQueryChange(event.target.value)}
      placeholder="Search mods…"
      autoComplete="off"
      className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:bg-background min-h-12 w-full rounded-xl border pr-12 pl-11 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none"
    />
    {query ? (
      <button
        type="button"
        onClick={() => onQueryChange("")}
        aria-label="Clear search"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <IconX size={16} />
      </button>
    ) : null}
  </div>
);

interface ModsFiltersProps {
  category: string;
  gameVersion: string;
  loader: string;
  onCategoryChange: (value: string) => void;
  onGameVersionChange: (value: string) => void;
  onLoaderChange: (value: string) => void;
  onSortChange: (value: string) => void;
  sort: string;
}

const ModsFilters = ({
  category,
  gameVersion,
  loader,
  onCategoryChange,
  onGameVersionChange,
  onLoaderChange,
  onSortChange,
  sort,
}: ModsFiltersProps) => (
  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <div>
      <label className="sr-only" htmlFor="mods-category">
        Category
      </label>
      <select
        id="mods-category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
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
        onChange={(event) => onGameVersionChange(event.target.value)}
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
        onChange={(event) => onLoaderChange(event.target.value)}
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
        onChange={(event) => onSortChange(event.target.value)}
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
);

const DEFAULT_SEARCH_PARAMS: ModSearchParams = {
  query: "",
  sort: DEFAULT_SORT,
};

interface ModsLoaderData {
  initial: ModSearchResponse | null;
  initialError: string | null;
}

// ---------------------------------------------------------------------------
// Search state managed via useReducer — consolidates result, error, and
// isSearching that were previously three separate useState hooks.
// ---------------------------------------------------------------------------

interface SearchState {
  result: ModSearchResponse | null;
  error: string | null;
  isSearching: boolean;
}

type SearchAction =
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; payload: ModSearchResponse }
  | { type: "SEARCH_ERROR"; payload: string }
  | { type: "RETRY" };

const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case "SEARCH_START": {
      return { ...state, isSearching: true, error: null };
    }
    case "SEARCH_SUCCESS": {
      return { result: action.payload, error: null, isSearching: false };
    }
    case "SEARCH_ERROR": {
      return { ...state, error: action.payload, isSearching: false };
    }
    case "RETRY": {
      return { result: null, error: null, isSearching: true };
    }
    default: {
      return state;
    }
  }
};

const ModsPage = () => {
  const { initial, initialError } = useLoaderData({ from: "/mods" });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [loader, setLoader] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [liveEvent, setLiveEvent] = useState<LiveModEvent | null>(null);
  const [state, dispatch] = useReducer(searchReducer, {
    result: initial,
    error: initialError,
    isSearching: false,
  });
  const hasMountedRef = useRef(false);
  const requestIdRef = useRef(0);

  const { result, error, isSearching } = state;

  // oxlint-disable-next-line react-doctor/react-compiler-no-manual-memoization -- React Compiler is not enabled in this project; useCallback keeps runSearch stable so the search effect does not re-run on every render
  const runSearch = useCallback(async (params: ModSearchParams) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;
    dispatch({ type: "SEARCH_START" });

    const cached = modsCache.get(params);
    if (cached) {
      if (requestIdRef.current === thisRequestId) {
        dispatch({ type: "SEARCH_SUCCESS", payload: cached });
      }
      return;
    }

    try {
      const data = await searchMods({ data: params });
      modsCache.set(params, data);

      if (requestIdRef.current === thisRequestId) {
        dispatch({ type: "SEARCH_SUCCESS", payload: data });
      }
    } catch (searchError) {
      if (requestIdRef.current === thisRequestId) {
        dispatch({
          type: "SEARCH_ERROR",
          payload: toErrorMessage(searchError),
        });
      }
    }
  }, []);

  useEffect(() => {
    // The loader already fetched the default search on the server; skip the
    // mount-time run so the initial data is not re-fetched on the client.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    runSearch({
      category,
      gameVersion,
      loader,
      query,
      sort,
    });
  }, [category, gameVersion, loader, query, runSearch, sort]);

  useEffect(() => {
    const source = new EventSource(`${API_URL}/api/events`);

    const handleEvent = (event: MessageEvent) => {
      try {
        // SAFETY: The event stream is produced by our own webhook endpoint,
        // which validates the payload shape before broadcasting.
        setLiveEvent(JSON.parse(event.data) as LiveModEvent);
      } catch {
        // Ignore malformed events from the stream.
      }
    };

    source.addEventListener("mod.created", handleEvent);
    source.addEventListener("mod.updated", handleEvent);
    source.addEventListener("mod.deleted", handleEvent);

    return () => {
      source.removeEventListener("mod.created", handleEvent);
      source.removeEventListener("mod.updated", handleEvent);
      source.removeEventListener("mod.deleted", handleEvent);
      source.close();
    };
  }, []);

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
    dispatch({ type: "SEARCH_START" });
  };

  const retry = () => {
    dispatch({ type: "RETRY" });
    runSearch({
      category,
      gameVersion,
      loader,
      query,
      sort,
    });
  };

  const refreshFromLiveEvent = () => {
    setLiveEvent(null);
    modsCache.delete({ category, gameVersion, loader, query, sort });
    runSearch({ category, gameVersion, loader, query, sort });
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

      <ModsSearchBar query={query} onQueryChange={setQuery} />

      <ModsFilters
        category={category}
        gameVersion={gameVersion}
        loader={loader}
        onCategoryChange={(value) => {
          setCategory(value);
          dispatch({ type: "SEARCH_START" });
        }}
        onGameVersionChange={(value) => {
          setGameVersion(value);
          dispatch({ type: "SEARCH_START" });
        }}
        onLoaderChange={(value) => {
          setLoader(value);
          dispatch({ type: "SEARCH_START" });
        }}
        onSortChange={(value) => {
          setSort(value);
          dispatch({ type: "SEARCH_START" });
        }}
        sort={sort}
      />

      {error ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={retry}
            className="border-destructive/30 text-destructive hover:bg-destructive/20 focus-visible:ring-ring min-h-11 rounded-lg border px-3 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            Try again
          </button>
        </div>
      ) : null}

      {liveEvent ? (
        <output className="border-primary/30 bg-primary/5 text-foreground mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
          <span>
            {LIVE_EVENT_LABELS[liveEvent.event]}: {liveEvent.data.name}
          </span>
          <button
            type="button"
            onClick={refreshFromLiveEvent}
            className="text-primary focus-visible:ring-ring min-h-10 rounded-lg px-3 text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Refresh results
          </button>
        </output>
      ) : null}

      {showSkeletons ? (
        <div
          aria-busy="true"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-52 rounded-2xl" />
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

          <ul
            aria-busy={isSearching}
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
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
  loader: async (): Promise<ModsLoaderData> => {
    const cached = modsCache.get(DEFAULT_SEARCH_PARAMS);
    if (cached) {
      return { initial: cached, initialError: null };
    }

    try {
      const data = await searchMods({ data: DEFAULT_SEARCH_PARAMS });
      modsCache.set(DEFAULT_SEARCH_PARAMS, data);
      return { initial: data, initialError: null };
    } catch (loaderError) {
      return { initial: null, initialError: toErrorMessage(loaderError) };
    }
  },
  component: ModsPage,
});
