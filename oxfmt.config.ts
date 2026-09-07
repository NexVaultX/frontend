import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // Markdown is formatted and validated by markdownlint (pnpm lint:md),
  // which enforces the GitHub ruleset (asterisk bullets, 80-char lines).
  // Excluding Markdown here prevents oxfmt from fighting markdownlint.
  ignorePatterns: [...(ultracite.ignorePatterns ?? []), "**/*.md"],
});
