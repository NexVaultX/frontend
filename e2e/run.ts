/// <reference types="node" />

import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

import type { Browser, Page } from "puppeteer";

import { createPage, launchBrowser } from "./helpers";

// --- Spec registry -------------------------------------------------------

interface Spec {
  name: string;
  run: (page: Page, baseUrl: string) => Promise<void>;
}

const specModules = await Promise.all([
  import("./specs/home.spec"),
  import("./specs/mods.spec"),
  import("./specs/login.spec"),
]);

const specs: Spec[] = specModules.map((mod) => mod.default);

// --- Server management ---------------------------------------------------

const PORT = process.env.PORT ?? "3001";
const BASE_URL = `http://localhost:${PORT}`;
const BUILD_CMD = "pnpm build";
const SERVER_CMD = "node .output/server/index.mjs";

const isServerReady = async (url: string, timeoutMs = 60_000) => {
  const start = Date.now();

  const poll = async (): Promise<boolean> => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not up yet — keep polling
    }

    if (Date.now() - start > timeoutMs) {
      return false;
    }

    await sleep(500);
    return await poll();
  };

  return await poll();
};

const startServer = async () => {
  // SAFETY: SERVER_CMD is a fixed project build command, not user input
  const child = spawn(SERVER_CMD, [], {
    detached: true,
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- fixed project command
    env: { ...process.env, PORT },
    shell: true,
    stdio: "ignore",
  });
  child.unref();

  console.log(`  Starting server on ${BASE_URL} …`);
  const ready = await isServerReady(BASE_URL);
  if (!ready) {
    child.kill();
    throw new Error(`Server did not become ready within 60 s at ${BASE_URL}`);
  }
  console.log("  Server is ready.\n");

  return child;
};

const stopServer = (child: ReturnType<typeof spawn> | undefined) => {
  if (!child?.pid) {
    return;
  }
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    // Already exited or no permission — ignore
  }
};

// --- Runner --------------------------------------------------------------

const runSpecs = async (browser: Browser, baseUrl: string) => {
  const page = await createPage(browser);
  let failures = 0;

  for (const spec of specs) {
    console.log(`  ▸ ${spec.name}`);
    try {
      // oxlint-disable-next-line no-await-in-loop -- Specs share one page and must run sequentially
      await spec.run(page, baseUrl);
    } catch (error) {
      failures += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`    ✗ FAILED: ${message}`);
    }
  }

  await page.close();
  return failures;
};

// --- Main ----------------------------------------------------------------

const skipBuild = process.argv.includes("--no-build");

console.log(`${"═".repeat(60)}`);
console.log("  NexVaultX E2E Test Suite (Puppeteer)");
console.log(`${"═".repeat(60)}`);

if (skipBuild) {
  if (!existsSync(".output")) {
    console.error("\n✗ --no-build was passed but .output/ does not exist.");
    console.error("  Run `pnpm build` (or `pnpm test:e2e`) first.\n");
    process.exit(1);
  }
  console.log("\n  Skipping build (--no-build).\n");
} else if (!existsSync(".output")) {
  console.log("\n▸ Building application …");
  execSync(BUILD_CMD, { stdio: "inherit" });
  console.log("  Build complete.\n");
} else {
  console.log("\n  .output/ exists — skipping build.\n");
}

const serverHandle = await startServer();

let failures = 0;
let browser: Browser | undefined;

try {
  console.log("▸ Launching headless browser …");
  browser = await launchBrowser();
  console.log("  Browser launched.\n");

  console.log(`▸ Running ${specs.length} spec(s) against ${BASE_URL}\n`);
  failures = await runSpecs(browser, BASE_URL);
} finally {
  // Always clean up — browser then server
  if (browser) {
    await browser.close().catch(() => undefined);
  }
  stopServer(serverHandle);
}

console.log(`\n${"═".repeat(60)}`);
if (failures > 0) {
  console.log(`  ✗ ${failures} spec(s) FAILED`);
  process.exit(1);
} else {
  console.log("  ✓ All specs passed");
}
console.log(`${"═".repeat(60)}`);
