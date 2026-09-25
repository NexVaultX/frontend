import { init } from "@github/markdownlint-github";
import markdownIt from "markdown-it";

const markdownItFactory = () => markdownIt({ html: true });

const options = {
  config: init({
    // MD041 (first-line-heading): files may intentionally begin with badges,
    // HTML, or images rather than a top-level heading.
    MD041: false,
  }),
  customRules: ["@github/markdownlint-github"],
  globs: ["**/*.md"],
  ignores: [
    ".opencode/**",
    ".tmp/**",
    "node_modules/**",
    ".git/**",
    ".output/**",
    "dist/**",
  ],
  markdownItFactory,
  outputFormatters: [
    ["markdownlint-cli2-formatter-pretty", { appendLink: true }],
  ],
};

export default options;
