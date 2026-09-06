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
  },
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});

export default env;
