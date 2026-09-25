import { Meilisearch } from "meilisearch";

import env from "../../env.config";

export const MODS_INDEX = "mods";

export const getSearchClient = () =>
  new Meilisearch({
    apiKey: env.MEILI_SEARCH_KEY,
    host: env.MEILI_HOST,
  });

export const getAdminClient = () =>
  new Meilisearch({
    apiKey: env.MEILI_MASTER_KEY,
    host: env.MEILI_HOST,
  });
