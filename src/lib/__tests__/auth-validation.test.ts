import { describe, expect, it } from "vitest";

import { validateLoginInput, validateSignupInput } from "@/lib/auth-validation";

describe(validateLoginInput, () => {
  it("returns no errors for valid input", () => {
    expect(validateLoginInput("user@example.com", "password123")).toStrictEqual(
      {}
    );
  });

  it("requires an email", () => {
    expect(validateLoginInput("", "password123")).toStrictEqual({
      email: "Email is required.",
    });
  });

  it("rejects an invalid email", () => {
    expect(validateLoginInput("not-an-email", "password123")).toStrictEqual({
      email: "Enter a valid email address.",
    });
  });

  it("requires a password", () => {
    expect(validateLoginInput("user@example.com", "")).toStrictEqual({
      password: "Password is required.",
    });
  });

  it("reports all missing fields", () => {
    expect(validateLoginInput("", "")).toStrictEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
  });
});

describe(validateSignupInput, () => {
  it("returns no errors for valid input", () => {
    expect(
      validateSignupInput("Test User", "user@example.com", "password123")
    ).toStrictEqual({});
  });

  it("requires a name", () => {
    expect(
      validateSignupInput("", "user@example.com", "password123")
    ).toStrictEqual({
      name: "Name is required.",
    });
  });

  it("requires an email", () => {
    expect(validateSignupInput("Test User", "", "password123")).toStrictEqual({
      email: "Email is required.",
    });
  });

  it("rejects an invalid email", () => {
    expect(
      validateSignupInput("Test User", "not-an-email", "password123")
    ).toStrictEqual({
      email: "Enter a valid email address.",
    });
  });

  it("requires a password", () => {
    expect(
      validateSignupInput("Test User", "user@example.com", "")
    ).toStrictEqual({
      password: "Password is required.",
    });
  });

  it("rejects a short password", () => {
    expect(
      validateSignupInput("Test User", "user@example.com", "short")
    ).toStrictEqual({
      password: "Password must be at least 8 characters.",
    });
  });

  it("reports all missing fields", () => {
    expect(validateSignupInput("", "", "")).toStrictEqual({
      email: "Email is required.",
      name: "Name is required.",
      password: "Password is required.",
    });
  });
});
