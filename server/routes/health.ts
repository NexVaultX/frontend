import { Elysia } from "elysia";

export const healthRoute = new Elysia().get("/api/health", () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));
