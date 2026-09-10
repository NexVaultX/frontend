import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const ADMIN_EMAIL = "itzzmateo@devflare.de";
const ADMIN_ROLE = "admin";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const result = await pool.query(
  "UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email, role",
  [ADMIN_ROLE, ADMIN_EMAIL]
);

if (result.rowCount === 0) {
  console.error(`No user found with email "${ADMIN_EMAIL}".`);
  process.exit(1);
}

const [user] = result.rows;
console.log(
  `✓ Set role="${user.role}" for ${user.name} <${user.email}> (${user.id})`
);

await pool.end();
