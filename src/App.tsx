import { cn } from "./styles";
import { useState, useEffect, useRef } from "react";
import { Garden } from "./components/Garden";
import { House, Lunch, Notebook } from "./components/Activities";
import { Art } from "./components/Art";
import { apply, mergeWorld, assistance, type Action } from "./game/engine";
import {
  load,
  persist,
  stash,
  cachedProfile,
  synchronize,
  type Local,
} from "./services/progress";
import { sound, speak } from "./services/audio";
import { hints } from "./data/content";
import { contextualHint } from "./game/hints";
export default function App() {
  const [local, setLocal] = useState(load);
  const current = useRef(local);
  current.current = local;
  const [panel, setPanel] = useState("");
  const [audio, setAudio] = useState(false);
  const [message, setMessage] = useState(
    "Chạm vào vườn nhé. Bạn nào đang trốn ở đây ta?",
  );
  const [status, setStatus] = useState("Đã cất trên máy");
  const [gate, setGate] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profiles, setProfiles] = useState<{ id: string; nickname: string }[]>(
    [],
  );
  const [signed, setSigned] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const syncing = useRef(false);
  const selectionRequest = useRef(0);
  const hintIndex = useRef(0);
  const say = (s: string, k = "flower") => {
    setMessage(s);
    sound(k, audio);
    speak(s, audio);
  };
  const act = (a: Action) => {
    setLocal((old) => {
      const world = apply(old.world, a, old.device);
      if (world === old.world) return old;
      const next = {
        ...old,
        world,
        pending: true,
      };
      try {
        persist(next);
        setStatus("Đã cất trên máy");
      } catch {
        setStatus("Máy chưa cất được. Con giữ trang này nhé.");
      }
      return next;
    });
    setAttempts(0);
  };
  const sync = async () => {
    if (syncing.current || !current.current.profile) return;
    syncing.current = true;
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
      setStatus("Đã cất vào khu vườn của con");
    } catch (e) {
      if (e instanceof Error && e.message === "AUTH") {
        setSigned(false);
        setProfiles([]);
      }
      setStatus(
        e instanceof Error && e.message === "AUTH"
          ? "Đã cất trên máy · Cần người lớn đăng nhập lại"
          : "Đã cất trên máy · Sẽ gửi khi có mạng",
      );
    } finally {
      syncing.current = false;
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
    const t = setInterval(() => {
      if (!panel) {
        const h = contextualHint(current.current.world);
        setMessage(h);
        setAttempts((a) => a + 3);
      }
    }, 25000);
    return () => clearInterval(t);
  }, [local.world, panel]);
  const account = async () => {
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
      const { world } = await r.json();
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
  return (
    <main>
      <header>
        <div className={cn("brand")}>
          <Art id="flower" />
          <span>
            little wonders<small>THẾ GIỚI NHỎ, ĐIỀU KỲ DIỆU TO</small>
          </span>
        </div>
        <nav>
          <button
            aria-label={audio ? "Tắt âm thanh" : "Bật âm thanh"}
            onClick={() => {
              setAudio(!audio);
              if (!audio) sound("flower", true);
            }}
          >
            {audio ? "♫" : "♪"}{" "}
            <span>{audio ? "Có âm thanh" : "Bật âm thanh"}</span>
          </button>
          <button aria-label="Sổ khám phá" onClick={() => setPanel("book")}>
            ▤ <span>Sổ khám phá</span>
          </button>
          <button
            aria-label="Dành cho người lớn"
            onClick={() => {
              setGate(false);
              setPanel("account");
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path
                d="m9 3 1-2h4l1 2 3 2 2 0 2 4-2 2v3l2 2-2 4h-3l-2 2h-5l-1-2-3-1H4l-2-4 2-2v-3L2 8l2-4 3 1Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </nav>
      </header>
      <Garden
        world={local.world}
        act={act}
        say={say}
        open={setPanel}
        highlight={assistance(attempts) !== "explore"}
        showSteps={assistance(attempts) === "demonstrate"}
      />
      <footer>
        <div className={cn("guide")}>
          <Art id="rabbit" />
          <p aria-live="polite">{message}</p>
          <button
            aria-label="Nghe gợi ý"
            onClick={() => {
              const h = hints[hintIndex.current++ % hints.length];
              say(h);
              setAttempts((a) => a + 3);
            }}
          >
            ?
          </button>
        </div>
        <span className={cn("save-status")}>● {status}</span>
        <button className={cn("rest")} onClick={() => setPanel("rest")}>
          Nghỉ một chút
        </button>
      </footer>
      {panel && (
        <div className={cn("modal-shade")}>
          <section
            className={cn(`modal ${panel === "account" ? "account" : ""}`)}
            role="dialog"
            aria-modal="true"
            aria-label="Góc nhỏ trong vườn"
          >
            <button
              className={cn("close")}
              aria-label="Trở về vườn"
              onClick={() => {
                selectionRequest.current++;
                setPanel("");
              }}
            >
              ×
            </button>
            {panel === "book" && <Notebook world={local.world} say={say} />}{" "}
            {panel === "house" && (
              <House world={local.world} act={act} say={say} />
            )}{" "}
            {panel === "lunch" && (
              <Lunch world={local.world} act={act} say={say} />
            )}{" "}
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
                {!gate ? (
                  <>
                    <p>Nhờ người lớn giúp nhé. Bảy cộng năm bằng bao nhiêu?</p>
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
                    {!signed ? (
                      <>
                        <a className={cn("primary")} href="/api/auth/login">
                          Tiếp tục với Google
                        </a>
                        <p>
                          Con có thể chơi trên máy này trước. Đăng nhập giúp lưu
                          giữa các thiết bị.
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
          </section>
        </div>
      )}
      <div className={cn("rotate-note")}>
        Con xoay màn hình ngang để nhìn cả khu vườn nhé!
      </div>
    </main>
  );
}
