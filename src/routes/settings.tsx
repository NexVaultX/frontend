import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { object, optional, parse, picklist } from "valibot";

import { SettingsDangerZone } from "@/components/settings/settings-danger-zone";
import { SettingsPasskeys } from "@/components/settings/settings-passkeys";
import { SettingsProfile } from "@/components/settings/settings-profile";
import { SettingsSessions } from "@/components/settings/settings-sessions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth.functions";

const settingsSearchSchema = object({
  tab: optional(picklist(["profile", "passkeys", "sessions", "danger"])),
});

const SettingsPage = () => {
  const router = useRouter();
  const navigate = useNavigate();
  // oxlint-disable-next-line no-use-before-define -- Route must be exported after the component for TanStack Router; SettingsPage only executes after Route is initialized
  const session = Route.useLoaderData();
  const { tab = "profile" } = useSearch({ from: "/settings" });

  const handleSignOut = async () => {
    let signOutError: string | null = null;

    try {
      const { error } = await authClient.signOut();
      if (error) {
        signOutError = error.message ?? "Could not sign out.";
      }
    } catch {
      signOutError = "Could not sign out.";
    }

    if (signOutError) {
      // Fall back to a hard navigation so the session state is re-read from
      // the cookie even if the client-side session store is stale.
      window.location.assign("/");
      return;
    }

    authClient.$store.notify("$sessionSignal");
    router.invalidate();
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
          <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {session?.user ? <SettingsProfile user={session.user} /> : null}
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
  validateSearch: (search: Record<string, string | undefined>) =>
    parse(settingsSearchSchema, search),
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
