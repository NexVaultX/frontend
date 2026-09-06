import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "../../env.config";
import { accounts, sessions, users, verifications } from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema: { accounts, sessions, users, verifications },
});

export { pool };
