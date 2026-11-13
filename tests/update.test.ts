import { describe, expect, it, vi } from "vitest";
import { UPDATE_CHECK_MS, watchForUpdates } from "../src/services/update";

function setup(
  controller: unknown = {},
  extra: {
    currentVersion?: string;
    fetchVersion?: () => Promise<string | null>;
  } = {},
) {
  const on: Record<string, () => void> = {};
  const pageOn: Record<string, () => void> = {};
  const worker = {
    state: "installing",
    listener: () => {},
    addEventListener(_: "statechange", fn: () => void) {
      this.listener = fn;
    },
  };
  const registration = {
    waiting: null as { postMessage: (m: unknown) => void } | null,
    installing: null as typeof worker | null,
    update: vi.fn(async () => {}),
    addEventListener: (type: string, fn: () => void) => (on[type] = fn),
  };
  const container = {
    controller,
    addEventListener: (type: string, fn: () => void) => (on[type] = fn),
  };
  const page = {
    hidden: false,
    addEventListener: (type: string, fn: () => void) => (pageOn[type] = fn),
  };
  let tick = () => {};
  let time = 100000;
  const reload = vi.fn();
  const notify = vi.fn();
  watchForUpdates({
    registration,
    container,
    page,
    reload,
    notify,
    now: () => time,
    setInterval: (fn) => (tick = fn),
    ...extra,
  });
  return {
    on,
    pageOn,
    worker,
    registration,
    page,
    reload,
    notify,
    tick: () => tick(),
    advance: (ms: number) => (time += ms),
  };
}

describe("picking up a new deploy", () => {
  it("asks an installed worker to take over", () => {
    const t = setup();
    const postMessage = vi.fn();
    t.registration.installing = t.worker;
    t.on.updatefound();
    t.registration.waiting = { postMessage };
    t.worker.state = "installed";
    t.worker.listener();
    expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });
  it("does not reload while the child is playing, only once the tab is hidden", async () => {
    const t = setup();
    t.registration.installing = t.worker;
    t.on.updatefound();
    t.registration.waiting = { postMessage: vi.fn() };
    t.worker.state = "installed";
    t.worker.listener();
    t.on.controllerchange();
    await Promise.resolve();
    expect(t.reload).not.toHaveBeenCalled();
    expect(t.notify).toHaveBeenCalledTimes(1);
    t.page.hidden = true;
    t.pageOn.visibilitychange();
    expect(t.reload).toHaveBeenCalledTimes(1);
    t.pageOn.visibilitychange();
    expect(t.reload).toHaveBeenCalledTimes(1);
  });
  it("reloads at once when the update lands in a hidden tab", async () => {
    const t = setup();
    t.registration.installing = t.worker;
    t.on.updatefound();
    t.registration.waiting = { postMessage: vi.fn() };
    t.worker.state = "installed";
    t.worker.listener();
    t.page.hidden = true;
    t.on.controllerchange();
    await Promise.resolve();
    expect(t.reload).toHaveBeenCalledTimes(1);
    expect(t.notify).not.toHaveBeenCalled();
  });
  it("ignores the very first install and spurious controllerchange events", async () => {
    const t = setup(null);
    t.page.hidden = true;
    t.on.controllerchange();
    await Promise.resolve();
    expect(t.reload).not.toHaveBeenCalled();
    expect(t.notify).not.toHaveBeenCalled();
    const t2 = setup();
    t2.on.controllerchange();
    await Promise.resolve();
    expect(t2.reload).not.toHaveBeenCalled();
    expect(t2.notify).not.toHaveBeenCalled();
  });
  it("checks on return and on the interval, never while hidden or in bursts", () => {
    const t = setup();
    t.pageOn.visibilitychange();
    t.pageOn.visibilitychange();
    expect(t.registration.update).toHaveBeenCalledTimes(1);
    t.advance(UPDATE_CHECK_MS);
    t.page.hidden = true;
    t.tick();
    expect(t.registration.update).toHaveBeenCalledTimes(1);
    t.page.hidden = false;
    t.tick();
    expect(t.registration.update).toHaveBeenCalledTimes(2);
  });
  it("does not notify on a fresh tab whose HTML already matches the deployed version", async () => {
    const t = setup(
      {},
      {
        currentVersion: "abc123",
        fetchVersion: async () => "abc123",
      },
    );
    t.registration.installing = t.worker;
    t.on.updatefound();
    t.registration.waiting = { postMessage: vi.fn() };
    t.worker.state = "installed";
    t.worker.listener();
    t.on.controllerchange();
    await Promise.resolve();
    expect(t.notify).not.toHaveBeenCalled();
    expect(t.reload).not.toHaveBeenCalled();
  });
  it("notifies once when version.json reports a newer deploy than the open page", async () => {
    let latest = "v1";
    const t = setup(
      {},
      {
        currentVersion: "v1",
        fetchVersion: async () => latest,
      },
    );
    t.tick();
    await Promise.resolve();
    expect(t.notify).not.toHaveBeenCalled();
    latest = "v2";
    t.advance(UPDATE_CHECK_MS);
    t.tick();
    await vi.waitFor(() => expect(t.notify).toHaveBeenCalledTimes(1));
    t.advance(UPDATE_CHECK_MS);
    t.tick();
    await Promise.resolve();
    expect(t.notify).toHaveBeenCalledTimes(1);
  });
});
