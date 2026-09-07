import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "@/db";

import env from "../../env.config";

export const auth = betterAuth({
  appName: "NexVaultX",
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    username(),
    // MUST be the last plugin for TanStack Start cookie handling
    tanstackStartCookies(),
  ],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    // 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // refresh on every request → sliding expiration
    updateAge: 0,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
