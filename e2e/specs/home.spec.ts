import type { Page } from "puppeteer";

import { goto } from "../helpers";

const homeSpec = {
  name: "Home page loads with key elements",
  run: async (page: Page, baseUrl: string) => {
    await goto(page, baseUrl);

    const heading = await page.waitForSelector("h1");
    const headingText = await heading?.evaluate((el) => el.textContent);
    if (!headingText) {
      throw new Error("Home page h1 has no text content");
    }

    const header = await page.$("header");
    if (!header) {
      throw new Error("Navbar (header element) not found on home page");
    }

    const footer = await page.$("footer");
    if (!footer) {
      throw new Error("Footer element not found on home page");
    }

    console.log("    ✓ Home page loaded — h1, navbar, footer all present");
  },
};

export default homeSpec;
