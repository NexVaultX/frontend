import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/posts";

describe(slugify, () => {
  it("lowercases and trims input", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("my first post")).toBe("my-first-post");
  });

  it("replaces runs of non-alphanumeric characters with a single hyphen", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles unicode characters", () => {
    expect(slugify("café au lait")).toBe("caf-au-lait");
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns an empty string for only separators", () => {
    expect(slugify("!!!")).toBe("");
  });
});
