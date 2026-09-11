import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { ModCard } from "@/components/mods/mod-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const toErrorMessage = (cause: unknown) => {
  if (!(cause instanceof Error)) {
    return "Could not search mods.";
  }

  const message = cause.message.toLowerCase();
  if (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("failed to fetch")
  ) {
    return "Could not reach the search service. Start the API server with `pnpm dev:all` and try again.";
  }

  if (message.includes("aborted due to timeout")) {
    return "The search service timed out. Please try again.";
  }

  return cause.message;
};

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
      name="query"
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
        <IconX size={16} aria-hidden="true" />
      </button>
    ) : null}
  </div>
);

interface ModsFiltersProps {
  category: string;
  gameVersion: string;
  loader: string;
  onCategoryChange: (value: string | null) => void;
  onGameVersionChange: (value: string | null) => void;
  onLoaderChange: (value: string | null) => void;
  onSortChange: (value: string | null) => void;
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
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger id="mods-category" className="w-full">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All categories</SelectItem>
          {MOD_CATEGORIES.map((value) => (
            <SelectItem key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <label className="sr-only" htmlFor="mods-game-version">
        Game version
      </label>
      <Select value={gameVersion} onValueChange={onGameVersionChange}>
        <SelectTrigger id="mods-game-version" className="w-full">
          <SelectValue placeholder="All versions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All versions</SelectItem>
          {MOD_GAME_VERSIONS.map((value) => (
            <SelectItem key={value} value={value}>
              Minecraft {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <label className="sr-only" htmlFor="mods-loader">
        Loader
      </label>
      <Select value={loader} onValueChange={onLoaderChange}>
        <SelectTrigger id="mods-loader" className="w-full">
          <SelectValue placeholder="All loaders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All loaders</SelectItem>
          {MOD_LOADERS.map((value) => (
            <SelectItem key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <label className="sr-only" htmlFor="mods-sort">
        Sort by
      </label>
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger id="mods-sort" className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

interface ModsPaginationProps {
  currentPage: number;
  isSearching: boolean;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const ModsPagination = ({
  currentPage,
  isSearching,
  onPageChange,
  totalPages,
}: ModsPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Mod list pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-11"
        disabled={currentPage <= 1 || isSearching}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <IconChevronLeft size={16} aria-hidden="true" />
        Previous
      </Button>

      <span className="text-muted-foreground min-w-24 text-center text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-11"
        disabled={currentPage >= totalPages || isSearching}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        Next
        <IconChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
};

interface LiveEventBannerProps {
  event: LiveModEvent;
  onRefresh: () => void;
}

const LiveEventBanner = ({ event, onRefresh }: LiveEventBannerProps) => (
  <output className="border-primary/30 bg-primary/5 text-foreground mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
    <span>
      {LIVE_EVENT_LABELS[event.event]}: {event.data.name}
    </span>
    <button
      type="button"
      onClick={onRefresh}
      className="text-primary focus-visible:ring-ring min-h-10 rounded-lg px-3 text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
    >
      Refresh results
    </button>
  </output>
);

const ModsSkeletons = () => (
  <div
    aria-busy="true"
    className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={index} className="h-52 rounded-2xl" />
    ))}
  </div>
);

interface ModsResultsProps {
  currentPage: number;
  isSearching: boolean;
  onPageChange: (page: number) => void;
  result: ModSearchResponse;
  totalPages: number;
}

const ModsResults = ({
  currentPage,
  isSearching,
  onPageChange,
  result,
  totalPages,
}: ModsResultsProps) => (
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

    <ModsPagination
      currentPage={currentPage}
      isSearching={isSearching}
      onPageChange={onPageChange}
      totalPages={totalPages}
    />
  </>
);

// oxlint-disable-next-line eslint/complexity -- ModsPage conditionally renders search, filters, skeleton, empty, results, and pagination states; extracting further would fragment the page logic
const ModsPage = () => {
  const { initial, initialError } = useLoaderData({ from: "/mods" });
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });
  const [category, setCategory] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [loader, setLoader] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
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
      page,
      query: debouncedQuery,
      sort,
    });
  }, [category, debouncedQuery, gameVersion, loader, page, runSearch, sort]);

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
  // If the loader returned no data and no error (e.g. first paint before the
  // client search resolves), keep skeletons visible instead of a blank page.
  const showInitialSkeletons = !isSearching && !error && !result;

  const totalPages = result
    ? Math.max(1, Math.ceil(result.estimatedTotalHits / result.pageSize))
    : 1;

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setGameVersion("");
    setLoader("");
    setPage(1);
    dispatch({ type: "SEARCH_START" });
  };

  const retry = () => {
    dispatch({ type: "RETRY" });
    runSearch({
      category,
      gameVersion,
      loader,
      page,
      query,
      sort,
    });
  };

  const refreshFromLiveEvent = () => {
    setLiveEvent(null);
    modsCache.delete({ category, gameVersion, loader, page, query, sort });
    runSearch({ category, gameVersion, loader, page, query, sort });
  };

  const changeFilter =
    (setter: (value: string) => void) => (value: string | null) => {
      setter(value ?? "");
      setPage(1);
      dispatch({ type: "SEARCH_START" });
    };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <PageHeader
        title="Mods"
        description="Discover performance, technology, adventure, and more — search thousands of Minecraft mods."
      />

      <ModsSearchBar query={query} onQueryChange={setQuery} />

      <ModsFilters
        category={category}
        gameVersion={gameVersion}
        loader={loader}
        onCategoryChange={changeFilter(setCategory)}
        onGameVersionChange={changeFilter(setGameVersion)}
        onLoaderChange={changeFilter(setLoader)}
        onSortChange={changeFilter(setSort)}
        sort={sort}
      />

      {error ? <ErrorState message={error} onRetry={retry} /> : null}

      {liveEvent ? (
        <LiveEventBanner event={liveEvent} onRefresh={refreshFromLiveEvent} />
      ) : null}

      {showSkeletons || showInitialSkeletons ? <ModsSkeletons /> : null}

      {showEmpty ? (
        <EmptyState
          title="No mods found"
          description="Try a different search or clear your filters."
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-primary focus-visible:ring-ring mt-4 min-h-10 rounded-lg px-3 text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      ) : null}

      {showResults ? (
        <ModsResults
          currentPage={page}
          isSearching={isSearching}
          onPageChange={setPage}
          result={result}
          totalPages={totalPages}
        />
      ) : null}
    </div>
  );
};

const ModsSkeleton = () => (
  <div
    aria-busy="true"
    className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
  >
    <Skeleton className="h-9 w-32" />
    <Skeleton className="mt-3 h-5 w-72 max-w-full" />
    <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-52 rounded-2xl" />
      ))}
    </div>
  </div>
);

export const Route = createFileRoute("/mods")({
  pendingComponent: ModsSkeleton,
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
