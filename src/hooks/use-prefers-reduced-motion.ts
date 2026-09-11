"use client";

import { useSyncExternalStore } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

// oxlint-disable-next-line promise/prefer-await-to-callbacks -- addEventListener/removeEventListener are callback-based DOM APIs, not promises; useSyncExternalStore requires this subscribe signature
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(MEDIA_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia(MEDIA_QUERY).matches;

const getServerSnapshot = () => false;

/** SSR-safe hook that tracks the `prefers-reduced-motion` media query. */
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export { usePrefersReducedMotion };
