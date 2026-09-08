import { Elysia, sse } from "elysia";

import { AsyncQueue, events } from "../lib/events";
import type { ModEvent } from "../lib/events";

export const eventsRoute = new Elysia().get(
  "/api/events",
  async function* streamModEvents() {
    const queue = new AsyncQueue<ModEvent>();
    const unsubscribe = events.subscribe((event) => queue.push(event));

    try {
      // Elysia awaits the first generator step before sending the response, so
      // yield a "connected" event immediately to open the stream.
      yield sse({ event: "connected", data: { message: "connected" } });

      while (true) {
        // oxlint-disable-next-line no-await-in-loop -- SSE events must be yielded in arrival order; parallelizing would reorder the stream.
        const event = await queue.next();
        if (!event) {
          break;
        }
        yield sse(event);
      }
    } finally {
      unsubscribe();
      queue.close();
    }
  }
);
