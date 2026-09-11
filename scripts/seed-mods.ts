import { config } from "dotenv";
import { Meilisearch } from "meilisearch";

import { MODS } from "../src/lib/mods-data.ts";

config({ path: ".env.local" });

const host = process.env.MEILI_HOST ?? "http://localhost:7700";
const apiKey = process.env.MEILI_MASTER_KEY;

if (!apiKey) {
  console.error(
    "MEILI_MASTER_KEY is required. Add it to .env.local and try again."
  );
  process.exit(1);
}

const client = new Meilisearch({ apiKey, host });
const index = client.index("mods");

console.log(`Seeding ${MODS.length} mods into ${host} (index: mods)`);

await index.updateSettings({
  filterableAttributes: ["category", "gameVersions", "loaders"],
  searchableAttributes: ["name", "description", "author", "tags", "category"],
  sortableAttributes: ["downloads", "updatedAt", "name"],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 1,
      twoTypos: 3,
    },
  },
});

const task = await index.addDocuments(MODS);
await client.tasks.waitForTask(task.taskUid);

console.log("Done. Mods index is ready.");
