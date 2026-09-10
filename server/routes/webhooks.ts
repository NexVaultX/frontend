import { createHmac, timingSafeEqual } from "node:crypto";

import { Elysia } from "elysia";
import { object, picklist, safeParse, string } from "valibot";

import "../env";
import { events } from "../lib/events";

const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET ?? "dev-webhook-secret-change-me";

const modEventSchema = object({
  event: picklist(["mod.created", "mod.updated", "mod.deleted"]),
  data: object({
    id: string(),
    name: string(),
  }),
});

const verifySignature = (payload: string, signature: string): boolean => {
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest();
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
};

export const webhooksRoute = new Elysia().post(
  "/api/webhooks/mods",
  async ({ request }) => {
    const signature = request.headers.get("x-webhook-signature") ?? "";
    const raw = await request.text();

    if (!verifySignature(raw, signature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    const parsed = safeParse(modEventSchema, body);
    if (!parsed.success) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    events.broadcast(parsed.output);
    return { ok: true };
  }
);
