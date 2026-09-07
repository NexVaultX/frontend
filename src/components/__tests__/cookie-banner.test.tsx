import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CookieBanner } from "@/components/cookie-banner";

const CONSENT_STORAGE_KEY = "nexvaultx-cookie-consent";

describe(CookieBanner, () => {
  it("renders when no consent has been stored", () => {
    render(<CookieBanner />);

    expect(screen.getByRole("region", { name: "Cookie consent" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Accept" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Decline" })).toBeTruthy();
  });

  it("does not render when consent has been accepted", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");

    render(<CookieBanner />);

    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });

  it("does not render when consent has been declined", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "declined");

    render(<CookieBanner />);

    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });

  it("persists the choice and hides after accepting", () => {
    render(<CookieBanner />);

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });

  it("persists the choice and hides after declining", () => {
    render(<CookieBanner />);

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("declined");
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
  });
});
