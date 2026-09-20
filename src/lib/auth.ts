import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "@/db";

import env from "../../env.config";
import { ac, admin as adminRole, user as userRole } from "./permissions";

const rpID = new URL(env.BETTER_AUTH_URL).hostname;

const socialProviders = {};

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  Object.assign(socialProviders, {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  });
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  Object.assign(socialProviders, {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  });
}

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

    tanstackStartCookies(),
  ],

  secret: env.BETTER_AUTH_SECRET,

  session: {
    expiresIn: 60 * 60 * 24 * 30,

    freshAge: 0,

    updateAge: 0,
  },

  socialProviders,

  trustedOrigins,

  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
