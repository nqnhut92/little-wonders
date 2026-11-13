import { cn } from "./styles";
import { useState, useEffect, useRef } from "react";
import { Garden } from "./components/Garden";
import { ValleyMap } from "./components/ValleyMap";
import {
  House,
  Lunch,
  Notebook,
  PalPanel,
  Xylophone,
} from "./components/Activities";
import { Art } from "./components/Art";
import { Kitchen } from "./components/Kitchen";
import { PaintFilters } from "./components/PaintFilters";
import { Icon } from "./components/Icons";
import { AdultCorner } from "./components/AdultCorner";
import { regionOpenId, regions } from "./data/regions";
import { scenes } from "./data/scenes";
import { regionState } from "./game/regions";
import { createScrollRegions } from "./ui/scroll-regions.js";
import {
  apply,
  mergeWorld,
  assistance,
  value,
  type Action,
  type World,
} from "./game/engine";
import { upgradeWorld } from "./game/upgrade";
import {
  load,
  persist,
  stash,
  cachedProfile,
  synchronize,
  forgetProfile,
  resetLocal,
  type Local,
} from "./services/progress";
import {
  sound,
  speak,
  loadAudioPreference,
  saveAudioPreference,
  setBackgroundMusic,
} from "./services/audio";
import { hints } from "./data/content";
import {
  nextSurpriseDelayMs,
  pickSurpriseEvent,
  type SurpriseEvent,
} from "./game/events";
type SaveKind = "local" | "synced" | "waiting";
function mapGreeting(world: World) {
  const extraOpen = regions.some(
    (r) => r.after && regionState(world.discoveries, r) === "open",
  );
  return extraOpen
    ? "Thung lũng nhỏ đang đợi con! Chọn một khu đã mở để khám phá nhé!"
    : "Chào con đến Thung lũng nhỏ! Chạm vào Vườn nhà để bắt đầu chơi nhé!";
}
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
  useEffect(() => {
    setBackgroundMusic(
      audio && panel !== "xylophone"
        ? activeRegion
          ? "play"
          : "valley"
        : null,
    );
  }, [audio, activeRegion, panel]);
  const [surprise, setSurprise] = useState<SurpriseEvent | null>(null);
  const lastTouch = useRef(Date.now());
  const [message, setMessage] = useState(() => mapGreeting(local.world));
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
  const [devMode, setDevMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const syncing = useRef(false);
  const selectionRequest = useRef(0);
  const hintIndex = useRef(0);
  const say = (s: string, k = "flower", spoken?: string) => {
    setMessage(s);
    sound(k, audio);
    speak(spoken ?? s, audio);
  };
  const act = (a: Action) => {
    setLocal((old) => {
      const world = apply(old.world, a, old.device);
      if (world === old.world) return old;
      if (devMode) return { ...old, world };
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
        if (first)
          say(`${first.name} đã mở ra rồi! Sương đang tan đó!`, "rainbow");
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
          say(
            event.message,
            event.kind === "shooting_star" ? "flower" : "butterfly",
          );
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
    return () => {
      regions.destroy();
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
      say(
        `Chào ${name}! Khu vườn đang đợi con đó!`,
        "flower",
        "Chào con! Khu vườn đang đợi con đó!",
      );
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
  const removeProfile = async (id: string): Promise<boolean> => {
    try {
      const r = await fetch(`/api/profiles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "X-Little-Wonders": "1" },
      });
      if (!r.ok) throw Error();
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      forgetProfile(id);
      if (current.current.profile === id) {
        const fresh = resetLocal(current.current.device);
        setLocal(fresh);
        setActiveRegion(null);
        setClearing([]);
        setStatus({ kind: "local", text: "Đã cất trên máy" });
        setMessage(mapGreeting(fresh.world));
      }
      return true;
    } catch {
      setMessage("Chưa xóa được hồ sơ. Người lớn thử lại khi có mạng nhé.");
      return false;
    }
  };
  const night = value<string>(local.world, "scene.time", "day") === "night";
  return (
    <main
      onPointerDown={() => {
        lastTouch.current = Date.now();
      }}
    >
      <PaintFilters />
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
          devMode={devMode}
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
      <div className={cn("hud hud-top-left")}>
        {activeRegion && (
          <button
            type="button"
            className={cn("hud-back kid-button")}
            aria-label="Quay lại bản đồ"
            title="Quay lại bản đồ"
            onClick={() => {
              setActiveRegion(null);
              setMessage(mapGreeting(local.world));
            }}
          >
            <Icon name="back" size={28} />
          </button>
        )}
        <div className={cn("hud-guide glass")}>
          <Art id="puppy" />
          <p aria-live="polite">{message}</p>
          <button
            type="button"
            className={cn("kid-button")}
            aria-label="Nghe gợi ý"
            title="Nghe gợi ý"
            onClick={() => {
              const h = activeRegion
                ? hints[hintIndex.current++ % hints.length]
                : mapGreeting(local.world);
              say(h, "puppy", h.replaceAll("Lucky", "Lắc-ki"));
              setAttempts((a) => a + 3);
            }}
          >
            <Icon name="bulb" size={28} />
          </button>
        </div>
      </div>
      {!activeRegion && (
        <button
          type="button"
          className={cn("hud hud-adult icon-button")}
          aria-label="Dành cho người lớn"
          title="Dành cho người lớn"
          onClick={() => {
            setGate(false);
            setPanel("account");
          }}
        >
          <Icon name="gear" size={20} />
        </button>
      )}
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
        {activeRegion && (
          <>
            <button
              type="button"
              className={cn("kid-button")}
              aria-label="Nghe chuyện vùng đất"
              title="Nghe chuyện vùng đất"
              onClick={() => {
                const story = scenes[activeRegion]?.story;
                if (story) say(story, "flower");
              }}
            >
              <Icon name="story" size={28} />
            </button>
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
              aria-label={
                night ? "Chuyển sang ban ngày" : "Chuyển sang ban đêm"
              }
              title={night ? "Chuyển sang ban ngày" : "Chuyển sang ban đêm"}
              aria-pressed={night}
              onClick={() => {
                const next = night ? "day" : "night";
                act({ type: "set", key: "scene.time", value: next });
                if (next === "night") {
                  act({ type: "discover", id: "night" });
                  say(
                    "Bầu trời chuyển sang ban đêm rồi, có sao và đom đóm kìa!",
                    "owl",
                  );
                } else say("Trời sáng rồi! Nắng ấm quay lại vườn!", "sun");
              }}
            >
              <Icon name={night ? "day-sun" : "night-moon"} size={28} />
            </button>
          </>
        )}
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
              {panel === "xylophone" && <Xylophone act={act} audio={audio} />}
              {panel === "account" && (
                <AdultCorner
                  world={local.world}
                  act={act}
                  say={say}
                  status={status.text}
                  busy={busy}
                  gate={gate}
                  onPass={() => {
                    setGate(true);
                    void account();
                  }}
                  onWrong={() => setMessage("Mình nhờ người lớn giúp nhé.")}
                  loadingProfiles={loadingProfiles}
                  signed={signed}
                  profiles={profiles}
                  currentProfile={local.profile}
                  devMode={devMode}
                  onToggleDevMode={() => {
                    setDevMode((was) => {
                      if (was)
                        setLocal((old) => ({ ...load(), device: old.device }));
                      return !was;
                    });
                  }}
                  nickname={nickname}
                  setNickname={setNickname}
                  onChoose={(id, name) => void choose(id, name)}
                  onCreate={() => void create()}
                  onDelete={(id) => removeProfile(id)}
                  onLogout={async () => {
                    await fetch("/api/auth/logout", {
                      method: "POST",
                      headers: { "X-Little-Wonders": "1" },
                    });
                    setSigned(false);
                  }}
                  onClose={() => {
                    selectionRequest.current++;
                    setPanel("");
                  }}
                />
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
