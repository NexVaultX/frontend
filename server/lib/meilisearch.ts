import { Meilisearch } from "meilisearch";

import "../env";

export const MODS_INDEX = "mods";

const host = process.env.MEILI_HOST ?? "http://localhost:7700";
const apiKey = process.env.MEILI_SEARCH_KEY || process.env.MEILI_MASTER_KEY;

export const getSearchClient = () =>
  new Meilisearch({
    apiKey,
    host,
  });
