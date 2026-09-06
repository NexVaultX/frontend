import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      // oxlint-disable-next-line sonarjs/function-name -- HTTP method names required by TanStack Start
      GET: ({ request }: { request: Request }) => auth.handler(request),
      // oxlint-disable-next-line sonarjs/function-name -- HTTP method names required by TanStack Start
      POST: ({ request }: { request: Request }) => auth.handler(request),
    },
  },
});
