import { config } from "dotenv";
import { defineEnv } from "envin";
import { z } from "zod";

config({ path: ".env.local" });

const env = defineEnv({
  env: process.env,
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    MEILI_HOST: z.url().default("http://localhost:7700"),
    MEILI_MASTER_KEY: z.string().optional(),
    MEILI_SEARCH_KEY: z.string().optional(),
  },
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});

export default env;
