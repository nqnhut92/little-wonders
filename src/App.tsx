import { cn } from "./styles";
import { useState, useEffect, useRef } from "react";
import { Garden } from "./components/Garden";
import { ValleyMap } from "./components/ValleyMap";
import { House, Lunch, Notebook, PalPanel, Xylophone } from "./components/Activities";
import { Art } from "./components/Art";
import { Kitchen } from "./components/Kitchen";
import { Icon, GoogleMark } from "./components/Icons";
import { regionOpenId, regions } from "./data/regions";
import {
  ThemeToggle,
  themeColors,
  themeStorageKey,
} from "./components/ThemeToggle";
import {
  createThemeController,
  type ThemeController,
  type ThemePreference,
} from "./ui/theme-controller.js";
import { createScrollRegions } from "./ui/scroll-regions.js";
import { apply, mergeWorld, assistance, value, type Action } from "./game/engine";
import { upgradeWorld } from "./game/upgrade";
import {
  load,
  persist,
  stash,
  cachedProfile,
  synchronize,
  type Local,
} from "./services/progress";
import {
  sound,
  speak,
  loadAudioPreference,
  saveAudioPreference,
} from "./services/audio";
import { hints } from "./data/content";
import {
  nextSurpriseDelayMs,
  pickSurpriseEvent,
  type SurpriseEvent,
} from "./game/events";
type SaveKind = "local" | "synced" | "waiting";
export default function App() {
  const [local, setLocal] = useState<Local>(() => ({
    ...load(),
    device: crypto.randomUUID(),
  }));
  const current = useRef(local);
  current.current = local;
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [clearing, setClearing] = useState<string[]>([]);
  const [panel, setPanel] = useState("");
  const [audio, setAudio] = useState(() => loadAudioPreference());
  const [surprise, setSurprise] = useState<SurpriseEvent | null>(null);
  const lastTouch = useRef(Date.now());
  const [message, setMessage] = useState(
    "Chạm vào vườn nhé. Bạn nào đang trốn ở đây ta?",
  );
  const [status, setStatus] = useState<{ kind: SaveKind; text: string }>({
    kind: "local",
    text: "Đã cất trên máy",
  });
  const [busy, setBusy] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [gate, setGate] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profiles, setProfiles] = useState<{ id: string; nickname: string }[]>(
    [],
  );
  const [signed, setSigned] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [themePref, setThemePref] = useState<ThemePreference>(
    () =>
      (document.documentElement.dataset.themePreference as ThemePreference) ||
      "system",
  );
  const themeController = useRef<ThemeController | null>(null);
  const syncing = useRef(false);
  const selectionRequest = useRef(0);
  const hintIndex = useRef(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const say = (s: string, k = "flower", spoken?: string) => {
    setMessage(s);
    sound(k, audio);
    speak(spoken ?? s, audio);
  };
  const act = (a: Action) => {
    setLocal((old) => {
      const world = apply(old.world, a, old.device);
      if (world === old.world) return old;
      const opened = regions
        .filter(
          (r) =>
            r.after &&
            !old.world.discoveries.includes(regionOpenId(r.id)) &&
            world.discoveries.includes(regionOpenId(r.id)),
        )
        .map((r) => r.id);
      if (opened.length) {
        setClearing((prev) => [...new Set([...prev, ...opened])]);
        const first = regions.find((r) => r.id === opened[0]);
        if (first) say(`${first.name} đã mở ra rồi! Sương đang tan đó!`, "rainbow");
      }
      const next = {
        ...old,
        world,
        pending: true,
      };
      try {
        persist(next);
        setStatus({ kind: "local", text: "Đã cất trên máy" });
      } catch {
        setStatus({
          kind: "waiting",
          text: "Máy chưa cất được. Con giữ trang này nhé.",
        });
      }
      return next;
    });
    setAttempts(0);
    lastTouch.current = Date.now();
  };
  const sync = async () => {
    if (syncing.current || !current.current.profile) return;
    syncing.current = true;
    setBusy(true);
    const snapshot = current.current;
    try {
      const result = await synchronize(snapshot);
      stash(result);
      setLocal((now) => {
        if (now.profile !== snapshot.profile) return now;
        const world = mergeWorld(now.world, result.world);
        const pending = now !== snapshot && now.pending;
        if (
          JSON.stringify(world) === JSON.stringify(now.world) &&
          pending === now.pending
        )
          return now;
        const updated = { ...now, world, pending };
        persist(updated);
        return updated;
      });
      setStatus({ kind: "synced", text: "Đã cất vào khu vườn của con" });
    } catch (e) {
      if (e instanceof Error && e.message === "AUTH") {
        setSigned(false);
        setProfiles([]);
      }
      setStatus({
        kind: "waiting",
        text:
          e instanceof Error && e.message === "AUTH"
            ? "Đã cất trên máy · Cần người lớn đăng nhập lại"
            : "Đã cất trên máy · Sẽ gửi khi có mạng",
      });
    } finally {
      syncing.current = false;
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!local.pending) return;
    const t = setTimeout(() => void sync(), 1500);
    return () => clearTimeout(t);
  }, [local]);
  useEffect(() => {
    const online = () => void sync();
    window.addEventListener("online", online);
    const timer = setInterval(online, 30000);
    return () => {
      window.removeEventListener("online", online);
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    let hide: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      if (!panel && activeRegion && Date.now() - lastTouch.current >= 45_000) {
        const event = pickSurpriseEvent(current.current.world);
        if (event) {
          setSurprise(event);
          say(event.message, event.kind === "shooting_star" ? "flower" : "butterfly");
          if (event.discovery) act({ type: "discover", id: event.discovery });
          hide = setTimeout(() => setSurprise(null), 4000);
        }
      }
    }, nextSurpriseDelayMs());
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, [local.world, panel, activeRegion]);
  useEffect(() => {
    const receive = (event: StorageEvent) => {
      if (event.key !== "little-wonders-v1" || !event.newValue) return;
      try {
        const incoming = JSON.parse(event.newValue) as Local;
        const other = upgradeWorld(incoming.world);
        setLocal((now) => {
          if (incoming.profile !== now.profile || !other) return now;
          const world = mergeWorld(now.world, other);
          if (JSON.stringify(world) === JSON.stringify(now.world)) return now;
          const next = { ...now, world, pending: true };
          persist(next);
          return next;
        });
      } catch {
        /* keep current progress when another tab contains invalid data */
      }
    };
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  }, []);
  useEffect(() => {
    const regions = createScrollRegions();
    const theme = createThemeController({
      storageKey: themeStorageKey,
      colors: themeColors,
      onChange: (state) => setThemePref(state.preference),
    });
    themeController.current = theme;
    return () => {
      regions.destroy();
      theme.destroy();
      themeController.current = null;
    };
  }, []);
  const account = async () => {
    setLoadingProfiles(true);
    try {
      const r = await fetch("/api/profiles");
      if (r.status === 401) {
        setSigned(false);
        setProfiles([]);
        return;
      }
      if (r.ok) {
        const data = await r.json();
        setProfiles(data.profiles);
        setSigned(true);
        if (current.current.profile) void sync();
      }
    } catch {
      /* offline garden remains available */
    } finally {
      setLoadingProfiles(false);
    }
  };
  useEffect(() => {
    void account();
    if (new URLSearchParams(location.search).has("connected")) {
      setPanel("account");
      setGate(true);
      history.replaceState({}, "", location.pathname);
    }
  }, []);
  const choose = async (id: string, name: string) => {
    const request = ++selectionRequest.current;
    try {
      const r = await fetch(`/api/progress?profile=${encodeURIComponent(id)}`);
      if (!r.ok) throw Error();
      const world = upgradeWorld((await r.json()).world);
      if (!world) throw Error();
      if (request !== selectionRequest.current) return;
      const old = current.current;
      const cached = cachedProfile(id);
      const previous =
        old.profile === id || !old.profile ? old.world : cached?.world;
      const next: Local = {
        ...old,
        profile: id,
        nickname: name,
        world: previous ? mergeWorld(previous, world) : world,
        pending: true,
      };
      persist(next);
      setLocal(next);
      setPanel("");
      say(`Chào ${name}! Khu vườn đang đợi con.`);
    } catch {
      setMessage(
        "Chưa mở được khu vườn. Mình vẫn có thể chơi trên máy này nhé.",
      );
    }
  };
  const create = async () => {
    if (!nickname.trim()) return;
    try {
      const r = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Little-Wonders": "1",
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });
      if (!r.ok) throw Error();
      const p = await r.json();
      await choose(p.id, p.nickname);
    } catch {
      setMessage("Chưa tạo được hồ sơ. Người lớn thử lại khi có mạng nhé.");
    }
  };
  const night = value<string>(local.world, "scene.time", "day") === "night";
  return (
    <main
      onPointerDown={() => {
        lastTouch.current = Date.now();
      }}
    >
      {activeRegion ? (
        <Garden
          regionId={activeRegion}
          world={local.world}
          act={act}
          say={say}
          open={setPanel}
          highlight={assistance(attempts) !== "explore"}
          showSteps={assistance(attempts) === "demonstrate"}
          surprise={surprise}
        />
      ) : (
        <ValleyMap
          world={local.world}
          clearing={clearing}
          say={say}
          onEnter={(id) => {
            setClearing((prev) => prev.filter((x) => x !== id));
            setActiveRegion(id);
            const r = regions.find((x) => x.id === id);
            if (r) setMessage(`Chào mừng con đến với ${r.name}!`);
          }}
        />
      )}
      {/* Controls float over the full-screen scene; there is no header or footer bar. */}
      <div className={cn("hud hud-guide glass")}>
        <Art id="rabbit" />
        <p aria-live="polite">{message}</p>
        <button
          type="button"
          className={cn("kid-button")}
          aria-label="Nghe gợi ý"
          title="Nghe gợi ý"
          onClick={() => {
            const h = activeRegion
              ? hints[hintIndex.current++ % hints.length]
              : "Con chạm vào Vườn nhà trên bản đồ để bắt đầu chơi nhé!";
            say(h);
            setAttempts((a) => a + 3);
          }}
        >
          <Icon name="bulb" size={28} />
        </button>
      </div>
      <nav className={cn("hud hud-actions")} aria-label="Nút điều khiển">
        <button
          type="button"
          className={cn("kid-button")}
          aria-label={audio ? "Tắt âm thanh" : "Bật âm thanh"}
          title={audio ? "Tắt âm thanh" : "Bật âm thanh"}
          aria-pressed={audio}
          onClick={() => {
            const next = !audio;
            setAudio(next);
            saveAudioPreference(next);
            if (next) sound("flower", true);
          }}
        >
          <Icon name={audio ? "speaker-on" : "speaker-off"} size={28} />
        </button>
        <button
          type="button"
          className={cn("kid-button")}
          aria-label="Sổ khám phá"
          title="Sổ khám phá"
          onClick={() => setPanel("book")}
        >
          <Icon name="book" size={28} />
        </button>
        <button
          type="button"
          className={cn("kid-button")}
          aria-label="Nghỉ một chút"
          title="Nghỉ một chút"
          onClick={() => setPanel("rest")}
        >
          <Icon name="cup" size={28} />
        </button>
        {activeRegion && (
          <>
            <button
              type="button"
              className={cn("kid-button")}
              aria-label="Bếp của vườn"
              title="Bếp của vườn"
              onClick={() => setPanel("kitchen")}
            >
              <Icon name="pot" size={28} />
            </button>
            <button
              type="button"
              className={cn("kid-button")}
              aria-label="Bản đồ thung lũng"
              title="Bản đồ thung lũng"
              onClick={() => setActiveRegion(null)}
            >
              <Icon name="map" size={28} />
            </button>
            <button
              type="button"
              className={cn("kid-button")}
              aria-label={night ? "Chuyển sang ban ngày" : "Chuyển sang ban đêm"}
              title={night ? "Chuyển sang ban ngày" : "Chuyển sang ban đêm"}
              aria-pressed={night}
              onClick={() => {
                const next = night ? "day" : "night";
                act({ type: "set", key: "scene.time", value: next });
                if (next === "night") {
                  act({ type: "discover", id: "night" });
                  say("Bầu trời chuyển sang ban đêm rồi, có sao và đom đóm kìa!", "owl");
                } else say("Trời sáng rồi! Nắng ấm quay lại vườn!", "sun");
              }}
            >
              <Icon name={night ? "day-sun" : "night-moon"} size={28} />
            </button>
            <button
              type="button"
              className={cn("kid-button hold-button")}
              aria-label="Vườn mới. Giữ một giây"
              title="Vườn mới. Giữ một giây"
              onPointerDown={() => {
                holdTimer.current = setTimeout(() => setPanel("fresh"), 1000);
              }}
              onPointerUp={() => clearTimeout(holdTimer.current)}
              onPointerLeave={() => clearTimeout(holdTimer.current)}
              onPointerCancel={() => clearTimeout(holdTimer.current)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setPanel("fresh");
              }}
              onClick={(e) => {
                // A quick tap only explains how to use it; keyboard activation already opened the question.
                if (e.detail === 0) return;
                setMessage("Giữ nút chổi một giây để dọn vườn mới nhé!");
              }}
            >
              <Icon name="broom" size={28} />
            </button>
          </>
        )}
        <span className={cn("hud-gap")} aria-hidden="true" />
        <button
          type="button"
          className={cn("icon-button")}
          aria-label="Dành cho người lớn"
          title="Dành cho người lớn"
          onClick={() => {
            setGate(false);
            setPanel("account");
          }}
        >
          <Icon name="gear" size={20} />
        </button>
      </nav>
      {panel && (
        <div className={cn("modal-shade")}>
          <section
            className={cn(`modal ${panel === "account" ? "account" : ""}`)}
            role="dialog"
            aria-modal="true"
            aria-label="Góc nhỏ trong vườn"
          >
            <button
              type="button"
              className={cn("close kid-button")}
              aria-label="Trở về vườn"
              title="Trở về vườn"
              onClick={() => {
                selectionRequest.current++;
                setPanel("");
              }}
            >
              <Icon name="close" size={26} />
            </button>
            <div className={cn("modal-body")} data-scroll-region>
              {panel === "book" && <Notebook world={local.world} say={say} />}{" "}
              {panel === "house" && (
                <House world={local.world} act={act} say={say} />
              )}{" "}
              {panel === "lunch" && (
                <Lunch world={local.world} act={act} say={say} />
              )}{" "}
              {panel.startsWith("pal:") && (
                <PalPanel
                  world={local.world}
                  act={act}
                  say={say}
                  palId={panel.slice(4)}
                />
              )}
              {panel === "kitchen" && (
                <Kitchen world={local.world} act={act} say={say} />
              )}
              {panel === "xylophone" && (
                <Xylophone act={act} audio={audio} />
              )}
              {panel === "fresh" && (
                <div className={cn("activity")}>
                  <Art id="grass" />
                  <h2>Dọn một khu vườn mới nhé?</h2>
                  <p>
                    Luống, giỏ và đồ trang trí sẽ trống. Sổ khám phá vẫn còn.
                  </p>
                  <div className={cn("gate")}>
                    <button
                      type="button"
                      className={cn("kid-button")}
                      aria-label="Có, dọn vườn mới"
                      onClick={() => {
                        act({ type: "resetGarden" });
                        setPanel("");
                        say("Khu vườn mới đang đợi con gieo hạt!");
                      }}
                    >
                      <Icon name="yes" size={30} />
                    </button>
                    <button
                      type="button"
                      className={cn("kid-button")}
                      aria-label="Không, giữ khu vườn"
                      onClick={() => setPanel("")}
                    >
                      <Icon name="no" size={30} />
                    </button>
                  </div>
                </div>
              )}
              {panel === "rest" && (
                <div className={cn("activity")}>
                  <Art id="cloud" />
                  <h2>Khu vườn đợi con nhé!</h2>
                  <p>Mình duỗi tay, uống nước và nhìn ra xa một chút.</p>
                  <button
                    onClick={() => {
                      selectionRequest.current++;
                      setPanel("");
                    }}
                  >
                    Về khu vườn
                  </button>
                </div>
              )}
              {panel === "account" && (
                <div className={cn("activity")}>
                  <h2>Góc dành cho người lớn</h2>
                  <div className={cn("adult-meta")}>
                    <span role="status">{busy ? "Đang đồng bộ…" : status.text}</span>
                    <ThemeToggle
                      preference={themePref}
                      onCycle={() => themeController.current?.cycle()}
                    />
                  </div>
                  {!gate ? (
                    <>
                      <p>
                        Nhờ người lớn giúp nhé. Bảy cộng năm bằng bao nhiêu?
                      </p>
                      <div className={cn("gate")}>
                        {[10, 12, 14].map((n) => (
                          <button
                            key={n}
                            onClick={() => {
                              if (n === 12) {
                                setGate(true);
                                void account();
                              } else setMessage("Mình nhờ người lớn giúp nhé.");
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        Chỉ cần biệt danh của bé. Không nhập tên thật hoặc thông
                        tin riêng tư.
                      </p>
                      {loadingProfiles && !signed ? (
                        <div
                          className={cn("skeleton-list")}
                          role="status"
                          aria-busy="true"
                          aria-label="Đang mở danh sách khu vườn"
                        >
                          <div
                            className={cn("skeleton-row")}
                            aria-hidden="true"
                          />
                          <div
                            className={cn("skeleton-row")}
                            aria-hidden="true"
                          />
                        </div>
                      ) : !signed ? (
                        <>
                          <a className={cn("primary")} href="/api/auth/login">
                            <span className={cn("provider-mark")}>
                              <GoogleMark />
                            </span>
                            Tiếp tục với Google
                          </a>
                          <p className={cn("footnote")}>
                            Con có thể chơi trên máy này trước. Đăng nhập giúp
                            lưu giữa các thiết bị. Chỉ dùng để nhận ra tài khoản
                            người lớn, không xin quyền nào khác.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className={cn("profiles")}>
                            {profiles.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => void choose(p.id, p.nickname)}
                              >
                                {p.nickname}
                              </button>
                            ))}
                          </div>
                          <label>
                            Biệt danh của bé
                            <input
                              maxLength={24}
                              value={nickname}
                              onChange={(e) => setNickname(e.target.value)}
                            />
                          </label>
                          <button onClick={() => void create()}>
                            Tạo khu vườn cho bé
                          </button>
                          <button
                            onClick={async () => {
                              await fetch("/api/auth/logout", {
                                method: "POST",
                                headers: { "X-Little-Wonders": "1" },
                              });
                              setSigned(false);
                            }}
                          >
                            Đăng xuất
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          selectionRequest.current++;
                          setPanel("");
                        }}
                      >
                        Về chơi trong vườn
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      <div className={cn("rotate-note")}>
        Con xoay màn hình ngang để nhìn cả khu vườn nhé!
      </div>
    </main>
  );
}
