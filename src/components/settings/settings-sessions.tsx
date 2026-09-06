"use client";

import { IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SessionItem {
  createdAt: Date | string;
  expiresAt: Date | string;
  id: string;
  ipAddress?: string | null;
  token: string;
  userAgent?: string | null;
}

interface SettingsSessionsProps {
  currentSessionToken?: string | null;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const parseUserAgent = (userAgent: string) => {
  let browser = "Browser";
  let os = "Device";

  if (/Edg\//u.test(userAgent)) {
    browser = "Edge";
  } else if (/Chrome\//u.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox\//u.test(userAgent)) {
    browser = "Firefox";
  } else if (/Safari\//u.test(userAgent)) {
    browser = "Safari";
  }

  if (/Windows/u.test(userAgent)) {
    os = "Windows";
  } else if (/Mac OS X/u.test(userAgent)) {
    os = "macOS";
  } else if (/Android/u.test(userAgent)) {
    os = "Android";
  } else if (/iPhone|iPad/u.test(userAgent)) {
    os = "iOS";
  } else if (/Linux/u.test(userAgent)) {
    os = "Linux";
  }

  const isMobile = /Android|iPhone|iPad/u.test(userAgent);

  return { browser, isMobile, os };
};

const formatDate = (value: Date | string) =>
  dateFormatter.format(new Date(value));

const SettingsSessions = ({ currentSessionToken }: SettingsSessionsProps) => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevokingOther, setIsRevokingOther] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error: loadError } = await authClient.listSessions();

      if (cancelled) {
        return;
      }

      setIsLoading(false);
      if (loadError) {
        setError(loadError.message ?? "Could not load sessions.");
        return;
      }

      setSessions(data ?? []);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRevoke = async (token: string) => {
    const { error: revokeError } = await authClient.revokeSession({ token });

    if (revokeError) {
      setError(revokeError.message ?? "Could not revoke session.");
      return;
    }

    setError(null);
    setSessions((prev) => prev.filter((session) => session.token !== token));
  };

  const handleRevokeOthers = async () => {
    setIsRevokingOther(true);
    const { error: revokeError } = await authClient.revokeOtherSessions();
    setIsRevokingOther(false);

    if (revokeError) {
      setError(revokeError.message ?? "Could not revoke other sessions.");
      return;
    }

    setError(null);
    setSessions((prev) =>
      prev.filter((session) => session.token === currentSessionToken)
    );
  };

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className="mt-4 grid gap-3">
        <div className="bg-muted h-16 animate-pulse rounded-lg" />
        <div className="bg-muted h-16 animate-pulse rounded-lg" />
      </div>
    );
  } else if (sessions.length === 0) {
    content = (
      <p className="text-muted-foreground mt-4 text-sm">
        No active sessions found.
      </p>
    );
  } else {
    content = (
      <ul className="mt-4 grid gap-3">
        {sessions.map((session) => {
          const { browser, isMobile, os } = parseUserAgent(
            session.userAgent ?? ""
          );
          const isCurrent = session.token === currentSessionToken;
          const DeviceIcon = isMobile ? IconDeviceMobile : IconDeviceDesktop;

          return (
            <li
              key={session.id}
              className="border-border bg-muted/40 flex items-center gap-3 rounded-lg border p-3"
            >
              <span
                aria-hidden="true"
                className="border-border bg-background text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border"
              >
                <DeviceIcon size={18} stroke={1.8} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                  <span className="truncate">
                    {browser} · {os}
                  </span>
                  {isCurrent ? (
                    <span className="border-border bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
                      Current
                    </span>
                  ) : null}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {session.ipAddress ?? "Unknown IP"} · Signed in{" "}
                  {formatDate(session.createdAt)}
                </p>
              </div>

              {isCurrent ? null : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 shrink-0"
                  onClick={() => handleRevoke(session.token)}
                >
                  Revoke
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby="settings-sessions-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="settings-sessions-heading"
            className="text-foreground text-lg font-semibold"
          >
            Sessions
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Devices signed in to your account.
          </p>
        </div>

        {sessions.length > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10"
            disabled={isRevokingOther}
            onClick={handleRevokeOthers}
          >
            {isRevokingOther ? "Signing out…" : "Sign Out Other Sessions"}
          </Button>
        ) : null}
      </div>

      {error ? (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2.5 text-sm"
        >
          {error}
        </div>
      ) : null}

      {content}
    </section>
  );
};

export { SettingsSessions };
