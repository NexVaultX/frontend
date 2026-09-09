"use client";

import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { z } from "zod";

import { SettingsAccount } from "@/components/settings/settings-account";
import { SettingsDangerZone } from "@/components/settings/settings-danger-zone";
import { SettingsPasskeys } from "@/components/settings/settings-passkeys";
import { SettingsProfile } from "@/components/settings/settings-profile";
import { SettingsSessions } from "@/components/settings/settings-sessions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth.functions";

const settingsSearchSchema = z.object({
  tab: z
    .enum(["profile", "account", "passkeys", "sessions", "danger"])
    .optional(),
});

const SettingsPage = () => {
  const router = useRouter();
  const navigate = useNavigate();
  // oxlint-disable-next-line no-use-before-define -- Route must be exported after the component for TanStack Router; SettingsPage only executes after Route is initialized
  const session = Route.useLoaderData();
  const { tab = "profile" } = useSearch({ from: "/settings" });

  const handleSignOut = async () => {
    await authClient.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        Settings
      </h1>
      <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
        Manage your account, sessions, and security.
      </p>

      <Tabs
        value={tab}
        onValueChange={(value) =>
          navigate({
            to: "/settings",
            search: { tab: value },
            replace: true,
          })
        }
        className="mt-8"
      >
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {session?.user ? <SettingsProfile user={session.user} /> : null}
        </TabsContent>

        <TabsContent value="account">
          <SettingsAccount />
        </TabsContent>

        <TabsContent value="passkeys">
          <SettingsPasskeys />
        </TabsContent>

        <TabsContent value="sessions">
          <SettingsSessions currentSessionToken={session?.session.token} />
        </TabsContent>

        <TabsContent value="danger">
          <SettingsDangerZone onSignOut={handleSignOut} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Route = createFileRoute("/settings")({
  validateSearch: settingsSearchSchema,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  loader: ({ context }) => context.session,
  component: SettingsPage,
});
