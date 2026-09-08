import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Mod } from "@/lib/mods-data";
import type { ModSearchParams, ModSearchResponse } from "@/lib/mods.functions";
import { Route } from "@/routes/mods";

const {
  cacheDeleteMock,
  cacheGetMock,
  cacheSetMock,
  searchModsMock,
  useLoaderDataMock,
} = vi.hoisted(() => ({
  cacheDeleteMock: vi.fn<(params: ModSearchParams) => void>(),
  cacheGetMock: vi.fn<() => ModSearchResponse | undefined>(),
  cacheSetMock:
    vi.fn<(params: ModSearchParams, data: ModSearchResponse) => void>(),
  searchModsMock:
    vi.fn<(opts: { data: ModSearchParams }) => Promise<ModSearchResponse>>(),
  useLoaderDataMock:
    vi.fn<
      () => { initial: ModSearchResponse | null; initialError: string | null }
    >(),
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Testing the mods page requires a faithful search stub; string path avoids strict factory type-checking against the server function type
vi.mock("@/lib/mods.functions", () => ({
  searchMods: searchModsMock,
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- The page reads the shared cache singleton; a controllable stub isolates cache behavior in tests
vi.mock("@/lib/mods-cache", () => ({
  modsCache: {
    delete: cacheDeleteMock,
    get: cacheGetMock,
    set: cacheSetMock,
  },
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- ModCard is covered by its own rendering; a stub keeps the page test focused on search state
vi.mock("@/components/mods/mod-card", () => ({
  ModCard: ({ mod }: { mod: Mod }) => (
    <div data-testid={`mod-card-${mod.id}`}>{mod.name}</div>
  ),
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Router context is unavailable in unit tests; string path avoids strict factory type-checking against the router module
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();
  // SAFETY: The actual module is spread at runtime to preserve createFileRoute; the cast only widens the type for the mock factory
  return {
    ...(actual as object),
    useLoaderData: useLoaderDataMock,
  };
});

const ModsPage = Route.options.component;
if (!ModsPage) {
  throw new Error("ModsPage component not found");
}

interface LiveModEvent {
  event: "mod.created" | "mod.updated" | "mod.deleted";
  data: { id: string; name: string };
}

class EventSourceMock {
  static readonly instances: EventSourceMock[] = [];
  listeners = new Map<string, (event: MessageEvent) => void>();
  closed = false;

  constructor(_url: string) {
    EventSourceMock.instances.push(this);
  }

  addEventListener(
    type: string,
    listener: (event: MessageEvent) => void
  ): void {
    this.listeners.set(type, listener);
  }

  removeEventListener(type: string): void {
    this.listeners.delete(type);
  }

  close(): void {
    this.closed = true;
  }

  emit(type: string, data: LiveModEvent): void {
    const listener = this.listeners.get(type);
    if (listener) {
      // SAFETY: The mock only needs the `data` field; the cast narrows the
      // minimal MessageEvent shape the page's handler reads.
      listener({ data: JSON.stringify(data) } as MessageEvent);
    }
  }
}

const modFixture: Mod = {
  author: "JellySquid",
  category: "performance",
  description: "A rendering engine replacement.",
  downloads: 14_200_000,
  gameVersions: ["1.21", "1.20.4"],
  id: "sodium",
  loaders: ["fabric", "forge"],
  name: "Sodium",
  tags: ["rendering"],
  updatedAt: "2026-01-01T00:00:00.000Z",
  version: "0.6.0",
};

const responseFixture = (hits: Mod[]): ModSearchResponse => ({
  estimatedTotalHits: hits.length,
  // oxlint-disable-next-line sonarjs/no-undefined-assignment -- Test fixture mirrors the server response shape
  facetDistribution: undefined,
  hits,
  query: "",
});

// Reassigned inside the skeleton test to resolve the in-flight search.
let resolveSearch: (value: ModSearchResponse) => void = (
  _value: ModSearchResponse
) => {};

describe("ModsPage", () => {
  beforeEach(() => {
    EventSourceMock.instances.splice(0);
    cacheDeleteMock.mockReset();
    cacheGetMock.mockReset();
    cacheSetMock.mockReset();
    searchModsMock.mockReset();
    useLoaderDataMock.mockReset();
    useLoaderDataMock.mockReturnValue({ initial: null, initialError: null });
    vi.stubGlobal("EventSource", EventSourceMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders initial results from the loader without a client re-fetch", () => {
    useLoaderDataMock.mockReturnValue({
      initial: responseFixture([modFixture]),
      initialError: null,
    });

    render(<ModsPage />);

    expect(screen.getByRole("heading", { name: "Mods" })).toBeTruthy();
    expect(screen.getByTestId("mod-card-sodium")).toBeTruthy();
    expect(screen.getByText("1 mod found")).toBeTruthy();
    expect(searchModsMock).not.toHaveBeenCalled();
  });

  it("shows skeletons with aria-busy while a search is in flight", async () => {
    searchModsMock.mockReturnValue(
      // oxlint-disable-next-line promise/avoid-new -- A deferred promise is the only way to hold a search in flight and assert the loading state
      new Promise<ModSearchResponse>((resolve) => {
        resolveSearch = resolve;
      })
    );

    render(<ModsPage />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "performance" },
    });

    const busyRegion = await screen.findByLabelText("Search mods");
    expect(busyRegion).toBeTruthy();

    // The results region is not rendered yet; skeletons are shown instead.
    expect(screen.queryByTestId("mod-card-sodium")).toBeNull();

    resolveSearch(responseFixture([modFixture]));
    await waitFor(() => {
      expect(screen.getByTestId("mod-card-sodium")).toBeTruthy();
    });
  });

  it("shows the empty state with a clear-filters action", async () => {
    searchModsMock.mockResolvedValue(responseFixture([]));

    render(<ModsPage />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "performance" },
    });

    await waitFor(() => {
      expect(screen.getByText("No mods found")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Category")).toHaveValue("");
    });
  });

  it("shows an error with a retry button and recovers on retry", async () => {
    searchModsMock.mockRejectedValueOnce(new Error("Search failed"));

    render(<ModsPage />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "performance" },
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Search failed");
    });

    searchModsMock.mockResolvedValueOnce(responseFixture([modFixture]));

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(screen.getByTestId("mod-card-sodium")).toBeTruthy();
    });
  });

  it("searches immediately as the query changes (real-time)", async () => {
    searchModsMock.mockResolvedValue(responseFixture([modFixture]));

    render(<ModsPage />);

    fireEvent.change(screen.getByLabelText("Search mods"), {
      target: { value: "sodium" },
    });

    await waitFor(() => {
      expect(searchModsMock).toHaveBeenCalledWith({
        data: expect.objectContaining({ query: "sodium" }),
      });
    });
  });

  it("shows a live-event banner and refreshes results on demand", async () => {
    searchModsMock.mockResolvedValue(responseFixture([modFixture]));

    render(<ModsPage />);

    const [source] = EventSourceMock.instances;
    expect(source).toBeTruthy();

    source.emit("mod.created", {
      data: { id: "new-mod", name: "New Mod" },
      event: "mod.created",
    });

    await expect(screen.findByText(/New mod added/u)).resolves.toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Refresh results" }));

    await waitFor(() => {
      expect(cacheDeleteMock).toHaveBeenCalledWith(
        expect.objectContaining({ query: "" })
      );
    });
    expect(searchModsMock).toHaveBeenCalledWith({
      data: expect.objectContaining({ query: "" }),
    });
  });

  it("serves cached results without calling the search function", async () => {
    cacheGetMock.mockReturnValue(responseFixture([modFixture]));

    render(<ModsPage />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "performance" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("mod-card-sodium")).toBeTruthy();
    });
    expect(searchModsMock).not.toHaveBeenCalled();
  });
});
