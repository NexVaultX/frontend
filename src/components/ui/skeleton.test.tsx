import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "@/components/ui/skeleton";

describe(Skeleton, () => {
  it("renders a decorative div with the skeleton styling", () => {
    const { container } = render(<Skeleton className="h-16" />);

    const skeleton = container.querySelector("div");
    expect(skeleton).toBeTruthy();
    expect(skeleton?.className).toContain("animate-pulse");
    expect(skeleton?.className).toContain("h-16");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />);

    expect(container.querySelector("div")?.getAttribute("aria-hidden")).toBe(
      "true"
    );
  });
});
