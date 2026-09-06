"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

interface SettingsDangerZoneProps {
  onSignOut: () => void;
}

const SettingsDangerZone = ({ onSignOut }: SettingsDangerZoneProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!password) {
      setError("Enter your password to confirm.");
      return;
    }

    setIsDeleting(true);
    const { error: deleteError } = await authClient.deleteUser({ password });
    setIsDeleting(false);

    if (deleteError) {
      setError(deleteError.message ?? "Could not delete your account.");
      return;
    }

    window.location.assign("/");
  };

  return (
    <section
      aria-labelledby="settings-danger-heading"
      className="border-destructive/30 bg-card rounded-xl border p-6"
    >
      <h2
        id="settings-danger-heading"
        className="text-destructive text-lg font-semibold"
      >
        Danger Zone
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Irreversible actions for your account.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="destructive"
          className="min-h-11 sm:px-6"
          onClick={onSignOut}
        >
          Sign Out
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="min-h-11 sm:px-6"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently removes your account, profile, and all associated
              data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDelete} noValidate className="grid gap-4">
            <FormField
              id="delete-password"
              label="Enter your password to confirm"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={error ?? undefined}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="min-h-11"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export { SettingsDangerZone };
