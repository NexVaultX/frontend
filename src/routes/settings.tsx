"use client";

import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

import { SettingsAccount } from "@/components/settings/settings-account";
import { SettingsDangerZone } from "@/components/settings/settings-danger-zone";
import { SettingsProfile } from "@/components/settings/settings-profile";
import { SettingsSessions } from "@/components/settings/settings-sessions";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth.functions";

const SettingsPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        Settings
      </h1>
      <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
        Manage your account, sessions, and security.
      </p>

      <div className="mt-8 grid gap-6">
        {session?.user ? <SettingsProfile user={session.user} /> : null}

        <SettingsAccount />

        <SettingsSessions currentSessionToken={session?.session.token} />

        <SettingsDangerZone onSignOut={handleSignOut} />
      </div>
    </main>
  );
};

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: SettingsPage,
});
