import { useEffect, useRef } from "react";

const QUACKBACK_SCRIPT_ID = "quackback-widget-sdk";

// Assumption: QuackBack's hosted cloud serves the official SDK at this URL
// and accepts the widget key as the `widgetKey` init option. The public docs
// only cover the self-hosted `<instance>/api/widget/sdk.js` pattern, so if
// the cloud snippet differs, this URL (and the init option below) is the one
// place to adjust.
const QUACKBACK_SDK_SRC = "https://quackback.io/api/widget/sdk.js";

// SAFETY: Vite exposes VITE_* vars as `any`; narrowing to string | undefined
// matches the runtime value (string when set, undefined when absent).
const WIDGET_KEY =
  (import.meta.env.VITE_QUACKBACK_WIDGET_KEY as string | undefined) ?? "";

type QuackBackCommand = unknown[];
type QuackBackStub = ((...args: QuackBackCommand) => void) & {
  q?: QuackBackCommand[];
};

declare global {
  interface Window {
    QuackBack?: QuackBackStub;
  }
}

const isConfigured = (key: string): boolean => key.trim().length > 0;

// Mirrors the official embed snippet: buffer QuackBack(...) calls until the
// async SDK loads, which then replays the queue automatically.
const createQueueStub = (): QuackBackStub => {
  const queue: QuackBackCommand[] = [];
  const stub: QuackBackStub = (...args: QuackBackCommand): void => {
    queue.push(args);
    stub.q = queue;
  };
  return stub;
};

const loadQuackback = (widgetKey: string): void => {
  if (window.QuackBack !== undefined) {
    return;
  }
  if (document.querySelector(`#${QUACKBACK_SCRIPT_ID}`) !== null) {
    return;
  }
  window.QuackBack ??= createQueueStub();
  const script = document.createElement("script");
  script.id = QUACKBACK_SCRIPT_ID;
  script.async = true;
  script.src = QUACKBACK_SDK_SRC;
  document.head.append(script);
  window.QuackBack("init", { widgetKey });
};

// Initializes the QuackBack feedback widget once, client-side only. Silent
// no-op when VITE_QUACKBACK_WIDGET_KEY is missing or empty.
const useQuackbackWidget = (): void => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !isConfigured(WIDGET_KEY)) {
      return;
    }
    initializedRef.current = true;
    loadQuackback(WIDGET_KEY);
  }, []);
};

export { useQuackbackWidget };
