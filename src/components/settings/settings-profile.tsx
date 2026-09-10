"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useState } from "react";
import { check, maxLength, minLength, pipe, regex, string } from "valibot";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SettingsProfileProps {
  user: {
    name: string;
    email?: string | null;
    username?: string | null;
  };
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/u;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;

const nameSchema = pipe(
  string(),
  check((value) => value.trim().length > 0, "Name is required.")
);

const usernameSchema = pipe(
  string(),
  check((value) => value.trim().length > 0, "Username is required."),
  minLength(MIN_USERNAME_LENGTH, "Username must be 3-30 characters."),
  maxLength(MAX_USERNAME_LENGTH, "Username must be 3-30 characters."),
  regex(USERNAME_PATTERN, "Use letters, numbers, underscores, or periods.")
);

const SettingsProfile = ({ user }: SettingsProfileProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fields are initialized from the session user and become the source of
  // truth; TanStack Form only re-syncs defaultValues while the form is
  // untouched, so the session prop never overwrites in-progress edits.
  const form = useForm({
    defaultValues: {
      name: user.name,
      username: user.username ?? "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setSuccess(false);
      const { error } = await authClient.updateUser({
        displayUsername: value.username.trim(),
        name: value.name.trim(),
        username: value.username.trim(),
      });
      if (error) {
        setFormError(error.message ?? "Could not update your profile.");
        return;
      }
      setSuccess(true);
    },
    onSubmitInvalid: () => {
      setFormError(null);
      setSuccess(false);
    },
  });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <section
      aria-labelledby="settings-profile-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <h2
        id="settings-profile-heading"
        className="text-foreground text-lg font-semibold"
      >
        Profile
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Update your display name and username.
      </p>

      {formError ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2.5 text-sm"
        >
          {formError}
        </div>
      ) : null}

      {success ? (
        <output className="border-border bg-muted/50 text-foreground mt-4 block rounded-lg border px-3 py-2.5 text-sm">
          Profile updated.
        </output>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
        aria-busy={isSubmitting}
        className="mt-4 grid gap-4"
      >
        <form.Field
          name="name"
          validators={{
            onChange: nameSchema,
            onSubmit: nameSchema,
          }}
        >
          {(field) => (
            <FormField
              id="profile-name"
              label="Display name"
              type="text"
              autoComplete="name"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.message}
              required
            />
          )}
        </form.Field>

        <form.Field
          name="username"
          validators={{
            onChange: usernameSchema,
            onSubmit: usernameSchema,
          }}
        >
          {(field) => (
            <FormField
              id="profile-username"
              label="Username"
              type="text"
              autoComplete="username"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.message}
              helperText="3-30 characters. Letters, numbers, underscores, and periods."
              required
            />
          )}
        </form.Field>

        <div className="grid gap-2">
          <span className="text-foreground text-sm font-medium">Email</span>
          <p className="text-muted-foreground border-input bg-muted/40 min-h-11 rounded-lg border px-3 py-2.5 text-sm">
            {user.email}
          </p>
        </div>

        <Button
          type="submit"
          variant="default"
          className="mt-1 min-h-11 w-full sm:w-auto sm:px-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </section>
  );
};

export { SettingsProfile };
