import { createHmac } from "node:crypto";

import { config } from "dotenv";

config({ path: ".env.local" });

const API_URL = process.env.API_URL ?? "http://localhost:3002";
const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET ?? "dev-webhook-secret-change-me";

const event = process.argv[2] ?? "mod.created";
const name = process.argv[3] ?? "Example Mod";

const payload = JSON.stringify({
  data: { id: `webhook-${Date.now()}`, name },
  event,
});

const signature = createHmac("sha256", WEBHOOK_SECRET)
  .update(payload)
  .digest("hex");

const response = await fetch(`${API_URL}/api/webhooks/mods`, {
  body: payload,
  headers: {
    "Content-Type": "application/json",
    "x-webhook-signature": signature,
  },
  method: "POST",
});

console.log(`Sent ${event} webhook for "${name}" → ${response.status}`);
