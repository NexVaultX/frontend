"use client";

import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { validateLoginInput } from "@/lib/auth-validation";
import { getSession } from "@/lib/auth.functions";

interface FieldErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const errors = validateLoginInput(email, password);

    setFieldErrors(errors);
    if (errors.email || errors.password) {
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.signIn.email({ email, password });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message ?? "Invalid email or password.");
      return;
    }

    router.navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
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

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
            required
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            required
          />

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="mt-2 min-h-11 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
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
