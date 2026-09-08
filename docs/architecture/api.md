# API Server

NexVaultX runs a standalone **ElysiaJS** API server (`server/`) on its own
port. It is the single entry point for mod search and real-time mod
events. The web app never talks to Meilisearch directly — the API server
proxies search and streams events to the browser over Server-Sent Events
(SSE).

## Running the server

```bash
pnpm dev:api      # watch mode (development)
pnpm start:api    # no watch (production-ish)
```

The server listens on `API_PORT` (default `3002`). Run it together with
the web app:

```bash
pnpm dev:all
```

## Environment variables

| Variable          | Description                                        |
| ----------------- | -------------------------------------------------- |
| `API_URL`         | Base URL of the API server (server-to-server)      |
| `API_PORT`        | Port the API server listens on (default `3002`)    |
| `WEBHOOK_SECRET`  | HMAC secret for webhook signatures (16+ chars)     |
| `VITE_API_URL`    | API base URL used by the browser (SSE client)      |
| `CORS_ORIGIN`     | Comma-separated allowed origins (optional)         |
| `MEILI_HOST`      | Meilisearch base URL                               |
| `MEILI_SEARCH_KEY`| Meilisearch search key (falls back to master key)  |

The server loads `.env.local` via `server/env.ts` (imported first in every
env-consuming module) and otherwise reads `process.env`, so it works in CI
without a local env file.

## Endpoints

### `GET /api/health`

Liveness check. Returns `{ ok: true }` when the server is up.

### `GET /api/mods/search`

Proxies the mods search to Meilisearch. Accepts the same query parameters
the mods page sends (`q`, `category`, `gameVersion`, `loader`, `sort`) and
returns the same shape as the previous direct Meilisearch call: `hits`,
`estimatedTotalHits`, `facetDistribution`, and `query`. Sort values are
whitelisted (`downloads:desc`, `updatedAt:desc`, `name:asc`).

### `GET /api/events`

Server-Sent Events stream. The response is a long-lived `text/event-stream`
that first yields a `connected` event, then broadcasts mod events as they
arrive:

```text
event: connected
data: {"message":"connected"}

event: mod.created
data: {"id":"mod-123","name":"My Mod"}
```

The browser subscribes with `EventSource`:

```ts
const source = new EventSource(`${API_URL}/api/events`);
source.addEventListener("mod.created", handleEvent);
```

### `POST /api/webhooks/mods`

Receives mod events from external publishers. The request must include an
`x-webhook-signature` header containing the HMAC-SHA256 digest of the raw
body, signed with `WEBHOOK_SECRET`:

```ts
import { createHmac } from "node:crypto";

const signature = createHmac("sha256", WEBHOOK_SECRET)
  .update(rawBody)
  .digest("hex");
```

The payload is validated with a Zod schema before broadcasting:

```json
{
  "event": "mod.created",
  "data": { "id": "mod-123", "name": "My Mod" }
}
```

Responses:

* `200` — signature valid and payload accepted, event broadcast to SSE
* `400` — invalid JSON or payload shape
* `401` — invalid signature

Send a test event with:

```bash
pnpm send:webhook mod.created "My Mod"
```

## Real-time flow

```text
publisher ──POST /api/webhooks/mods──▶ API server ──SSE──▶ browser
```

1. A publisher (or `pnpm send:webhook`) posts a signed mod event.
2. The API server verifies the HMAC signature, validates the payload, and
   broadcasts it to every SSE subscriber.
3. The mods page receives the event and shows a live banner ("New mod
   added", "Mod updated", "Mod removed") with a "Refresh results" button
   that bypasses the search cache.

## Directory layout

```text
server/
├── index.ts              # Elysia entry point (Node adapter, CORS)
├── env.ts                # Loads .env.local before env reads
├── lib/
│   ├── events.ts         # Subscriber registry + AsyncQueue for SSE
│   └── meilisearch.ts    # Meilisearch client factory
└── routes/
    ├── health.ts         # GET /api/health
    ├── mods.ts           # GET /api/mods/search
    ├── events.ts         # GET /api/events (SSE)
    └── webhooks.ts       # POST /api/webhooks/mods
```

## Related

* [Meilisearch](../search/meilisearch.md)
* [Architecture Overview](overview.md)
* [Commands](../development/commands.md)
