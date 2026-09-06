"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { validatePasswordChangeInput } from "@/lib/auth-validation";

interface FieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface PasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FormStatus =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success" }
  | { type: "error"; message: string };

const initialFields: PasswordFields = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
};

const SettingsAccount = () => {
  const [fields, setFields] = useState<PasswordFields>(initialFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const handleFieldChange =
    (field: keyof PasswordFields) => (event: ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validatePasswordChangeInput(
      fields.currentPassword,
      fields.newPassword,
      fields.confirmPassword
    );

    if (
      errors.currentPassword ||
      errors.newPassword ||
      errors.confirmPassword
    ) {
      setFieldErrors(errors);
      return;
    }

    setStatus({ type: "submitting" });

    const { error } = await authClient.changePassword({
      currentPassword: fields.currentPassword,
      newPassword: fields.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setStatus({
        message: error.message ?? "Could not change your password.",
        type: "error",
      });
      return;
    }

    setFields(initialFields);
    setFieldErrors({});
    setStatus({ type: "success" });
  };

  return (
    <section
      aria-labelledby="settings-account-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <h2
        id="settings-account-heading"
        className="text-foreground text-lg font-semibold"
      >
        Account
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Change your password. Other sessions will be signed out.
      </p>

      {status.type === "error" ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2.5 text-sm"
        >
          {status.message}
        </div>
      ) : null}

      {status.type === "success" ? (
        <output className="border-border bg-muted/50 text-foreground mt-4 block rounded-lg border px-3 py-2.5 text-sm">
          Password updated.
        </output>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-4">
        <FormField
          id="current-password"
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={fields.currentPassword}
          onChange={handleFieldChange("currentPassword")}
          error={fieldErrors.currentPassword}
          required
        />

        <FormField
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={fields.newPassword}
          onChange={handleFieldChange("newPassword")}
          error={fieldErrors.newPassword}
          helperText="At least 8 characters."
          required
        />

        <FormField
          id="confirm-password"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={handleFieldChange("confirmPassword")}
          error={fieldErrors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="default"
          className="mt-1 min-h-11 w-full sm:w-auto sm:px-6"
          disabled={status.type === "submitting"}
        >
          {status.type === "submitting" ? "Updating…" : "Change Password"}
        </Button>
      </form>
    </section>
  );
};

export { SettingsAccount };
