import { setTimeout as sleep } from "node:timers/promises";

import type { Page } from "puppeteer";

import { goto } from "../helpers";

const modsSpec = {
  name: "Mods page renders shell and search is interactive",
  run: async (page: Page, baseUrl: string) => {
    // Navigate to /mods (direct navigation; the navbar link is covered by
    // the home spec's header presence check)
    await goto(page, `${baseUrl}/mods`);

    // Page shell renders: h1 "Mods"
    await page.waitForSelector("h1");
    const h1Text = await page.$eval("h1", (el) => el.textContent);
    if (!h1Text?.includes("Mods")) {
      throw new Error(`Expected h1 to contain "Mods", got "${h1Text ?? ""}"`);
    }

    // Search input with sr-only label "Search mods"
    const searchInput = await page.waitForSelector("#mods-search");
    if (!searchInput) {
      throw new Error("Search input (#mods-search) not found on mods page");
    }

    // Filter selects present
    const categorySelect = await page.$("#mods-category");
    if (!categorySelect) {
      throw new Error("Category select (#mods-category) not found");
    }

    const gameVersionSelect = await page.$("#mods-game-version");
    if (!gameVersionSelect) {
      throw new Error("Game version select (#mods-game-version) not found");
    }

    const loaderSelect = await page.$("#mods-loader");
    if (!loaderSelect) {
      throw new Error("Loader select (#mods-loader) not found");
    }

    const sortSelect = await page.$("#mods-sort");
    if (!sortSelect) {
      throw new Error("Sort select (#mods-sort) not found");
    }

    // Search input is interactive: typing updates the value
    const testQuery = "sodium";
    await searchInput.type(testQuery, { delay: 50 });
    const inputValue = await page.$eval("#mods-search", (el) => {
      // SAFETY: #mods-search is an <input> element by construction (see src/routes/mods.tsx)
      const input = el as HTMLInputElement;
      return input.value;
    });
    if (inputValue !== testQuery) {
      throw new Error(
        `Expected search input value "${testQuery}", got "${inputValue}"`
      );
    }

    // Wait for the debounced search to settle — the page may show results,
    // an empty state, or an error depending on Meilisearch availability.
    // The page shell (h1, search input, selects) is the robust assertion.
    await sleep(1_000);

    console.log(
      "    ✓ Mods page — shell (h1, search input, selects) renders, search interactive"
    );
  },
};

export default modsSpec;
