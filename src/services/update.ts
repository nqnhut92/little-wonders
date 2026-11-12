// Picks up a new deploy without any message to the child: the service worker checks for a newer sw.js
// (its BUILD_ID changes with every build) and the waiting worker takes over. A hidden tab reloads silently;
// a visible one is told through UPDATE_READY so a calm dialog can offer the reload (no timer, nothing is
// forced mid-play). Pending local progress lives in storage and survives.

export const UPDATE_READY = "little-wonders:update-ready";
export const UPDATE_CHECK_MS = 30 * 60 * 1000;
const MIN_GAP_MS = 5000;

interface Registration {
  waiting: { postMessage(message: unknown): void } | null;
  installing: {
    state: string;
    addEventListener(type: "statechange", fn: () => void): void;
  } | null;
  update(): Promise<unknown>;
  addEventListener(type: "updatefound", fn: () => void): void;
}
interface Container {
  controller: unknown;
  addEventListener(type: "controllerchange", fn: () => void): void;
}
interface Page {
  hidden: boolean;
  addEventListener(type: "visibilitychange", fn: () => void): void;
}

export interface UpdateEnv {
  registration: Registration;
  container: Container;
  page: Page;
  reload(): void;
  // Called when the new version is ready while the child is still looking at the page.
  notify(): void;
  now(): number;
  setInterval(fn: () => void, ms: number): unknown;
}

export function watchForUpdates(env: UpdateEnv) {
  const { registration, container, page } = env;
  // The first install also fires controllerchange (clients.claim); only a replaced worker means a new version.
  const hadController = Boolean(container.controller);
  let reloadPending = false;
  let lastCheck = -Infinity;

  const reloadIfHidden = () => {
    if (reloadPending && page.hidden) {
      reloadPending = false;
      env.reload();
    }
  };
  const activateWaiting = () => {
    if (registration.waiting && container.controller)
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };
  const check = () => {
    const now = env.now();
    if (now - lastCheck < MIN_GAP_MS) return;
    lastCheck = now;
    void registration.update().catch(() => {});
  };

  container.addEventListener("controllerchange", () => {
    if (!hadController) return;
    reloadPending = true;
    if (page.hidden) reloadIfHidden();
    else env.notify();
  });
  registration.addEventListener("updatefound", () => {
    const worker = registration.installing;
    worker?.addEventListener("statechange", () => {
      if (worker.state === "installed") activateWaiting();
    });
  });
  page.addEventListener("visibilitychange", () => {
    if (page.hidden) reloadIfHidden();
    else check();
  });
  env.setInterval(() => {
    if (!page.hidden) check();
  }, UPDATE_CHECK_MS);
  activateWaiting();
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").then((registration) =>
      watchForUpdates({
        registration,
        container: navigator.serviceWorker,
        page: {
          get hidden() {
            return document.hidden;
          },
          addEventListener: (type, fn) => document.addEventListener(type, fn),
        },
        reload: () => location.reload(),
        notify: () => window.dispatchEvent(new Event(UPDATE_READY)),
        now: () => Date.now(),
        setInterval: (fn, ms) => window.setInterval(fn, ms),
      }),
    );
  });
}
