"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { validateProfileInput } from "@/lib/auth-validation";

interface SettingsProfileProps {
  user: {
    name: string;
    email?: string | null;
    username?: string | null;
  };
}

interface FieldErrors {
  name?: string;
  username?: string;
}

const SettingsProfile = ({ user }: SettingsProfileProps) => {
  // oxlint-disable-next-line react-doctor/no-derived-useState -- Form fields are intentionally initialized from the session user and become the source of truth (controlled inputs); the session prop must not re-sync the form while the user is editing.
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    const errors = validateProfileInput(name, username);

    setFieldErrors(errors);
    if (errors.name || errors.username) {
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.updateUser({
      displayUsername: username.trim(),
      name: name.trim(),
      username: username.trim(),
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message ?? "Could not update your profile.");
      return;
    }

    setSuccess(true);
  };

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

      <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-4">
        <FormField
          id="profile-name"
          label="Display name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          required
        />

        <FormField
          id="profile-username"
          label="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={fieldErrors.username}
          helperText="3-30 characters. Letters, numbers, underscores, and periods."
          required
        />

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
