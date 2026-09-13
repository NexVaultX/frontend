import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "@/db";

import env from "../../env.config";
import { ac, admin as adminRole, user as userRole } from "./permissions";

const rpID = new URL(env.BETTER_AUTH_URL).hostname;

const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

const trustedOrigins = [
  env.BETTER_AUTH_URL,
  "http://localhost:6001",
  ...(env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []),
];

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
    admin({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    passkey({
      origin: env.BETTER_AUTH_URL,
      rpID,
      rpName: "NexVaultX",
    }),
    // MUST be the last plugin for TanStack Start cookie handling
    tanstackStartCookies(),
  ],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    // 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // treat every session as fresh → avoids "Session is not fresh" errors
    // for listSessions, passkey registration, and other fresh-gated endpoints
    freshAge: 0,
    // refresh on every request → sliding expiration
    updateAge: 0,
  },
  socialProviders: googleProvider,
  trustedOrigins,
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
