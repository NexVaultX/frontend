"use client";

import {
  IconDeviceMobile,
  IconFingerprint,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const formatDate = (value: Date) => dateFormatter.format(value);

const SettingsPasskeys = () => {
  const {
    data: passkeys,
    error: listError,
    isPending,
    refetch,
  } = authClient.useListPasskeys();
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    setIsAdding(true);

    const { error } = await authClient.passkey.addPasskey({
      name: name.trim() || "Passkey",
    });

    setIsAdding(false);

    if (error) {
      setActionError(error.message ?? "Could not add passkey.");
      return;
    }

    setName("");
    refetch();
  };

  const handleRemove = async (id: string) => {
    setActionError(null);
    setRemovingId(id);

    const { error } = await authClient.$fetch("/passkey/delete-passkey", {
      body: { id },
      method: "POST",
    });

    setRemovingId(null);

    if (error) {
      setActionError(error.message ?? "Could not remove passkey.");
      return;
    }

    refetch();
  };

  return (
    <section
      aria-labelledby="settings-passkeys-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="settings-passkeys-heading"
            className="text-foreground text-lg font-semibold"
          >
            Passkeys
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in securely with a passkey on this device.
          </p>
        </div>
      </div>

      {listError ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2.5 text-sm"
        >
          {listError.message ?? "Could not load passkeys."}
        </div>
      ) : null}

      {actionError ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2.5 text-sm"
        >
          {actionError}
        </div>
      ) : null}

      <form
        onSubmit={handleAdd}
        noValidate
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <label className="sr-only" htmlFor="passkey-name">
          Passkey name
        </label>
        <input
          id="passkey-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. My laptop"
          autoComplete="off"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring min-h-11 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <Button
          type="submit"
          variant="default"
          className="min-h-11"
          disabled={isAdding}
        >
          <IconPlus size={16} />
          {isAdding ? (
            <>
              <Spinner className="mr-1" />
              Adding…
            </>
          ) : (
            "Add Passkey"
          )}
        </Button>
      </form>

      {isPending ? (
        <div aria-busy="true" className="mt-4 grid gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : null}

      {!isPending && passkeys && passkeys.length === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">
          No passkeys yet. Add one to sign in without a password.
        </p>
      ) : null}

      {!isPending && passkeys && passkeys.length > 0 ? (
        <ul aria-busy={isPending} className="mt-4 grid gap-3">
          {passkeys.map((passkey) => {
            const isSynced = passkey.deviceType === "multiDevice";
            const DeviceIcon = isSynced ? IconFingerprint : IconDeviceMobile;

            return (
              <li
                key={passkey.id}
                className="border-border bg-muted/40 flex items-center gap-3 rounded-lg border p-3"
              >
                <span
                  aria-hidden="true"
                  className="border-border bg-background text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border"
                >
                  <DeviceIcon size={18} stroke={1.8} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {passkey.name ?? "Passkey"}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {isSynced ? "Synced passkey" : "Device-bound passkey"} ·
                    Added {formatDate(passkey.createdAt)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 shrink-0"
                  disabled={removingId === passkey.id}
                  onClick={() => handleRemove(passkey.id)}
                >
                  <IconTrash size={15} />
                  {removingId === passkey.id ? (
                    <>
                      <Spinner className="mr-1" />
                      Removing…
                    </>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
};

export { SettingsPasskeys };
