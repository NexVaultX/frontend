import puppeteer from "puppeteer";
import type { Browser, LaunchOptions, Page } from "puppeteer";

const LAUNCH_OPTIONS: LaunchOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  headless: true,
};

const DEFAULT_TIMEOUT = 15_000;

const launchBrowser = () => puppeteer.launch(LAUNCH_OPTIONS);

const createPage = async (browser: Browser) => {
  const page = await browser.newPage();
  page.setDefaultTimeout(DEFAULT_TIMEOUT);
  return page;
};

const goto = (page: Page, path: string) =>
  page.goto(path, {
    timeout: DEFAULT_TIMEOUT,
    waitUntil: "domcontentloaded",
  });

const waitForText = (page: Page, text: string) =>
  page.waitForFunction(
    (needle: string) => document.body?.textContent.includes(needle) ?? false,
    { timeout: DEFAULT_TIMEOUT },
    text
  );

const waitForGone = (page: Page, text: string) =>
  page.waitForFunction(
    (needle: string) => !(document.body?.textContent.includes(needle) ?? false),
    { timeout: DEFAULT_TIMEOUT },
    text
  );

const dismissCookieBanner = async (page: Page) => {
  const acceptButton = await page.$(
    'section[aria-label="Cookie consent"] button'
  );
  if (!acceptButton) {
    return;
  }
  await acceptButton.click();
  await page.waitForFunction(
    () => !document.querySelector('section[aria-label="Cookie consent"]'),
    { timeout: DEFAULT_TIMEOUT }
  );
};

export {
  DEFAULT_TIMEOUT,
  LAUNCH_OPTIONS,
  createPage,
  dismissCookieBanner,
  goto,
  launchBrowser,
  waitForGone,
  waitForText,
};
