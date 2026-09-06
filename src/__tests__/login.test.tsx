import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Route } from "@/routes/login";

interface AuthResult {
  error: { message: string } | null;
}

const { navigate, signInEmail } = vi.hoisted(() => ({
  navigate: vi.fn<(opts: { to: string }) => void>(),
  signInEmail:
    vi.fn<(opts: { email: string; password: string }) => Promise<AuthResult>>(),
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Testing the login form requires a faithful auth client stub; string path avoids strict factory type-checking against the real auth client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: signInEmail,
    },
  },
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Server function is only used in beforeLoad, not by the component; string path avoids strict factory type-checking against the server function type
vi.mock("@/lib/auth.functions", () => ({
  getSession: vi.fn<() => Promise<null>>(),
}));

// oxlint-disable-next-line anti-slop/no-module-mocking, vitest/prefer-import-in-mock -- Router context is unavailable in unit tests; string path avoids strict factory type-checking against the router module
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();
  // SAFETY: The actual module is spread at runtime to preserve createFileRoute/redirect; the cast only widens the type for the mock factory
  return {
    ...(actual as object),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    useRouter: () => ({ navigate }),
  };
});

const LoginPage = Route.options.component;
if (!LoginPage) {
  throw new Error("LoginPage component not found");
}

describe("LoginPage", () => {
  beforeEach(() => {
    navigate.mockReset();
    signInEmail.mockReset();
  });

  it("renders the email and password fields", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeTruthy();
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await expect(screen.findByText("Email is required.")).resolves.toBeTruthy();
    expect(screen.getByText("Password is required.")).toBeTruthy();
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("shows a validation error for an invalid email", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await expect(
      screen.findByText("Enter a valid email address.")
    ).resolves.toBeTruthy();
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("calls signIn.email and navigates home on success", async () => {
    signInEmail.mockResolvedValue({ error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      // oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- Test fixture password
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(signInEmail).toHaveBeenCalledWith({
        email: "user@example.com",
        // oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- Test fixture password
        password: "password123",
      });
    });
    expect(navigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("shows the server error message on failed sign-in", async () => {
    signInEmail.mockResolvedValue({
      error: { message: "Invalid email or password" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await expect(
      screen.findByText("Invalid email or password")
    ).resolves.toBeTruthy();
    expect(navigate).not.toHaveBeenCalled();
  });
});
