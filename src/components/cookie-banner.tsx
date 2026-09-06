"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const CONSENT_STORAGE_KEY = "openvault-cookie-consent";
const CONSENT_EVENT = "openvault-cookie-consent-change";

type Consent = "accepted" | "declined";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
};

const getSnapshot = (): boolean => {
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "declined";
};

const getServerSnapshot = (): boolean => false;

const handleChoice = (choice: Consent) => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  window.dispatchEvent(new Event(CONSENT_EVENT));
};

const CookieBanner = () => {
  const hasConsent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (hasConsent) {
    return null;
  }

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4"
    >
      <div className="border-border bg-background/95 animate-in fade-in slide-in-from-bottom-2 ease-smooth mx-auto max-w-3xl rounded-xl border p-4 shadow-lg backdrop-blur duration-300 motion-reduce:animate-none sm:p-5">
        <p className="text-foreground text-sm leading-6">
          We use cookies to keep you signed in and remember your preferences. By
          continuing, you agree to our use of cookies.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="default"
            onClick={() => handleChoice("accepted")}
            className="min-h-11"
          >
            Accept
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleChoice("declined")}
            className="min-h-11"
          >
            Decline
          </Button>
        </div>
      </div>
    </section>
  );
};

export { CookieBanner };
