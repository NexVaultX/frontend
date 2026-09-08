import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Route } from "@/routes/projects";

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Router context is unavailable in unit tests; string path avoids strict factory type-checking against the router module
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();
  // SAFETY: The actual module is spread at runtime to preserve createFileRoute; the cast only widens the type for the mock factory
  return {
    ...(actual as object),
    Link: ({ children, to }: { children: ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const ProjectsPage = Route.options.component;
if (!ProjectsPage) {
  throw new Error("ProjectsPage component not found");
}

describe("ProjectsPage", () => {
  it("renders the page heading and the Mods section", () => {
    render(<ProjectsPage />);

    expect(screen.getByRole("heading", { name: "Projects" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mods" })).toBeTruthy();
  });

  it("renders the remaining project sections", () => {
    render(<ProjectsPage />);

    expect(screen.getByRole("heading", { name: "Modpacks" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Plugins" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Resource Packs" })
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Shaders" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Servers" })).toBeTruthy();
  });

  it("links the Mods section to /mods", () => {
    render(<ProjectsPage />);

    const modsLink = screen.getByRole("link", { name: /Browse mods/u });
    expect(modsLink).toHaveAttribute("href", "/mods");
  });

  it("marks unavailable sections as coming soon", () => {
    render(<ProjectsPage />);

    expect(screen.getAllByText("Coming soon")).toHaveLength(5);
  });
});
