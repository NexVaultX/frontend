import { config } from "dotenv";

// Load .env.local before any module reads process.env. Import this module
// first in every server file that consumes environment variables.
config({ path: ".env.local" });
