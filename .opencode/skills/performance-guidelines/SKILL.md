---
name: performance-guidelines
description: Review code for web performance best practices and integrate TanStack Pacer (debounce/throttle/rate-limit/queue) and TanStack Virtual (list virtualization) where appropriate. Use when asked to "review performance", "optimize", "check bundle size", "reduce re-renders", "debounce", "throttle", "rate limit", "virtualize a list", or "audit performance".
version: 1.0.0
author: nexvaultx
type: skill
category: performance
tags:
  - performance
  - optimization
  - pacer
  - virtual
  - debounce
  - throttle
  - virtualization
  - bundle
  - cls
---

# Performance Guidelines

**Purpose**: Review and optimize code for web performance, integrating TanStack Pacer and TanStack Virtual where they fit.

## What I Do

- Review files for performance anti-patterns (unbounded lists, unthrottled handlers, layout thrash, CLS, bundle bloat)
- Recommend TanStack Pacer hooks (`useDebouncedValue`, `useThrottledCallback`, `useRateLimitedCallback`, `useQueue`) for rate-limiting expensive work
- Recommend TanStack Virtual (`useVirtualizer`, `useWindowVirtualizer`) for large lists and tables
- Output findings in a terse `file:line` format

## How to Use Me

### Step 1: Identify the Hot Spots

Read the specified files, or prompt the user for files/pattern if none are provided. Look for:

- `.map()` over arrays that can exceed ~50 items (virtualize)
- Search inputs or event handlers that fire expensive work on every keystroke (debounce/throttle)
- API calls without rate limiting (rate limit)
- Animations on `width`/`height`/`top`/`left` (use `transform`/`opacity`)
- `<img>` without explicit `width`/`height` (CLS)
- Layout reads and writes interleaved in loops (layout thrash)
- `transition: all` or broad `* { transition: ... }` (list properties explicitly)
- Client-only rendering that could be server-rendered (SSR/hydration)

### Step 2: Apply TanStack Pacer

Install with `pnpm add @tanstack/react-pacer`.

Use the right hook for the job:

| Pattern | Hook |
| --- | --- |
| Search input driving an API call | `useDebouncedValue` (value) or `useDebouncedCallback` (fn) |
| Window resize / scroll handler | `useThrottledCallback` |
| Value that updates at most N times per second | `useThrottledValue` |
| API calls capped per time window | `useRateLimitedCallback` |
| Sequential task processing | `useQueue` |
| Polling / periodic work | `useInterval` |

Example — debounce the mods search query:

```tsx
const [query, setQuery] = useState("");
const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });

useEffect(() => {
  runSearch({ query: debouncedQuery, ... });
}, [debouncedQuery, ...]);
```

Notes:

- Pacer hooks use TanStack Store; by default there are NO reactive subscriptions — pass a `selector` to opt into re-renders (e.g. `(state) => ({ isPending: state.isPending })` for loading indicators)
- Prefer `useDebouncedValue` over `useDebouncedCallback` when the value drives an effect

### Step 3: Apply TanStack Virtual

Install with `pnpm add @tanstack/react-virtual`.

Use `useVirtualizer` when a list, table, or grid can exceed ~50 items:

```tsx
const parentRef = useRef<HTMLDivElement>(null);
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
  overscan: 5,
});
```

- Use `useWindowVirtualizer` when the scroll container is the window
- Use `measureElement` plus a `data-index` attribute for dynamic/variable item sizes
- Use `initialRect`/`initialOffset` for SSR viewport hints
- Combine with infinite scroll: fetch the next page when `lastItem.index >= allRows.length - 1`
- For grids, virtualize rows and render columns inside each row

### Step 4: Apply General Performance Rules

- Animate only `transform`/`opacity`; keep animations under 400ms; honor `prefers-reduced-motion`
- Every `<img>` needs explicit `width`/`height` (prevents CLS); lazy-load below-fold images
- Use `content-visibility: auto` for long off-screen sections
- Avoid barrel files; prefer specific imports
- No `dangerouslySetInnerHTML` unless necessary
- Clean up event listeners and observers in effects
- Use `Intl.NumberFormat`/`Intl.DateTimeFormat` instead of hardcoded formats
- Batch DOM reads before writes (avoid layout thrash)
- React Compiler is NOT enabled — memoize with `useCallback`/`useMemo` only where it measurably helps

### Step 5: Output Findings

Output findings in terse `file:line` format, grouped by file. State the issue and location; skip explanation unless the fix is non-obvious.

## Tips

- Verify the actual data size before recommending virtualization — a list capped at 24 items (e.g. the mods search `limit: 24`) does NOT need `useVirtualizer`
- Debounce search inputs before recommending server calls — the mods page currently fires `runSearch` on every keystroke
- Run `pnpm check`, `pnpm typecheck`, and `pnpm test` after changes
- Check bundle impact with `pnpm check:bundle` after adding dependencies