"use client";

import { useForm, useStore } from "@tanstack/react-form";
import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { check, nonEmpty, pipe, regex, string } from "valibot";

import { FormField } from "@/components/form-field";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth.functions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

const emailSchema = pipe(
  string(),
  check((value) => value.trim().length > 0, "Email is required."),
  regex(EMAIL_PATTERN, "Enter a valid email address.")
);

const passwordSchema = pipe(string(), nonEmpty("Password is required."));

const LoginPage = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const { error } = await authClient.signIn.email(value);
      if (error) {
        setFormError(error.message ?? "Invalid email or password.");
        return;
      }
      router.navigate({ to: "/" });
    },
    onSubmitInvalid: () => {
      setFormError(null);
    },
  });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Sign in to your NexVaultX account.
        </p>

        {formError ? (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive mt-6 rounded-lg border px-3 py-2.5 text-sm"
          >
            {formError}
          </div>
        ) : null}

        <div className="mt-6">
          <GoogleSignInButton />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <hr className="bg-border h-px flex-1 border-0" />
          <span className="text-muted-foreground text-xs tracking-wide uppercase">
            or
          </span>
          <hr className="bg-border h-px flex-1 border-0" />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          noValidate
          aria-busy={isSubmitting}
          className="mt-6 grid gap-4"
        >
          <form.Field
            name="email"
            validators={{
              onChange: emailSchema,
              onSubmit: emailSchema,
            }}
          >
            {(field) => (
              <FormField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com…"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: passwordSchema,
              onSubmit: passwordSchema,
            }}
          >
            {(field) => (
              <FormField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]?.message}
                required
              />
            )}
          </form.Field>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="mt-2 min-h-11 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-1.5" label="Signing in" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
