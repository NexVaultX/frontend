import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("src", import.meta.url).pathname,
    },
  },
  test: {
    coverage: {
      exclude: ["src/test/**"],
      include: [
        "src/components/cookie-banner.tsx",
        "src/components/ui/skeleton.tsx",
        "src/components/ui/spinner.tsx",
        "src/lib/auth-validation.ts",
        "src/lib/mods-cache.ts",
        "src/routes/login.tsx",
        "src/routes/mods.tsx",
        "src/routes/signup.tsx",
      ],
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**", ".opencode/**"],
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
