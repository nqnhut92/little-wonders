import { useState } from "react";
import { cn } from "../styles";
import { Icon, GoogleMark } from "./Icons";
import { regions } from "../data/regions";
import { regionState } from "../game/regions";
import { regionHasProgress, type Action, type World } from "../game/engine";

type Props = {
  world: World;
  act: (a: Action) => void;
  say: (s: string, k?: string, spoken?: string) => void;
  status: string;
  busy: boolean;
  gate: boolean;
  onPass: () => void;
  onWrong: () => void;
  loadingProfiles: boolean;
  signed: boolean;
  profiles: { id: string; nickname: string }[];
  currentProfile?: string;
  nickname: string;
  setNickname: (v: string) => void;
  onChoose: (id: string, name: string) => void;
  onCreate: () => void;
  onLogout: () => void;
  onClose: () => void;
};

type Tab = "save" | "tidy";
// Nothing waiting: the list of regions. Otherwise the one thing being confirmed.
type Confirm = null | { region: string } | "all";

// Everything an adult can do, in two clearly named places: where the garden is saved, and tidying it up.
export function AdultCorner(p: Props) {
  const [tab, setTab] = useState<Tab>("save");
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [done, setDone] = useState("");

  if (!p.gate)
    return (
      <div className={cn("activity")}>
        <h2>Góc dành cho người lớn</h2>
        <p>Nhờ người lớn giúp nhé. Bảy cộng năm bằng bao nhiêu?</p>
        <div className={cn("gate")}>
          {[10, 12, 14].map((n) => (
            <button
              key={n}
              onClick={() => (n === 12 ? p.onPass() : p.onWrong())}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );

  const open = regions.filter(
    (r) => regionState(p.world.discoveries, r) === "open",
  );
  const target =
    confirm && confirm !== "all"
      ? regions.find((r) => r.id === confirm.region)
      : null;

  return (
    <div className={cn("activity adult")}>
      <h2>Góc dành cho người lớn</h2>
      <div className={cn("adult-meta")}>
        <span role="status">{p.busy ? "Đang đồng bộ…" : p.status}</span>
      </div>
      <div className={cn("adult-tabs")} role="tablist">
        {(
          [
            ["save", "Lưu khu vườn"],
            ["tidy", "Dọn khu vườn"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setConfirm(null);
              setDone("");
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "save" && (
        <section className={cn("adult-section")}>
          {p.loadingProfiles && !p.signed ? (
            <div
              className={cn("skeleton-list")}
              role="status"
              aria-busy="true"
              aria-label="Đang mở danh sách khu vườn"
            >
              <div className={cn("skeleton-row")} aria-hidden="true" />
              <div className={cn("skeleton-row")} aria-hidden="true" />
            </div>
          ) : !p.signed ? (
            <>
              <p>
                Bé chơi được ngay trên máy này. Đăng nhập để khu vườn của bé
                được cất lại và chơi tiếp trên máy khác.
              </p>
              <a className={cn("primary")} href="/api/auth/login">
                <span className={cn("provider-mark")}>
                  <GoogleMark />
                </span>
                Tiếp tục với Google
              </a>
              <p className={cn("footnote")}>
                Chỉ dùng để nhận ra tài khoản người lớn, không xin quyền nào
                khác.
              </p>
            </>
          ) : (
            <>
              {p.profiles.length > 0 && (
                <>
                  <h3>Chọn khu vườn của bé</h3>
                  <div className={cn("adult-list")}>
                    {p.profiles.map((x) => (
                      <button
                        key={x.id}
                        aria-pressed={x.id === p.currentProfile}
                        onClick={() => p.onChoose(x.id, x.nickname)}
                      >
                        {x.nickname}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <h3>Thêm bé mới</h3>
              <label>
                Biệt danh của bé (không nhập tên thật)
                <input
                  maxLength={24}
                  value={p.nickname}
                  onChange={(e) => p.setNickname(e.target.value)}
                />
              </label>
              <button className={cn("quiet-primary")} onClick={p.onCreate}>
                Tạo khu vườn cho bé
              </button>
              <button className={cn("wide-button")} onClick={p.onLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </section>
      )}

      {tab === "tidy" && (
        <section className={cn("adult-section")}>
          {confirm === null && (
            <>
              <h3>Dọn lại một khu</h3>
              <p className={cn("footnote")}>
                Luống trồng sẽ trống để bé chơi lại. Sổ khám phá, bạn thú và giỏ
                đồ vẫn còn.
              </p>
              <div className={cn("adult-list")}>
                {open.map((r) => {
                  const busyRegion = regionHasProgress(p.world, r.id);
                  return (
                    <button
                      key={r.id}
                      disabled={!busyRegion}
                      aria-label={`Dọn lại ${r.name}`}
                      onClick={() => {
                        setDone("");
                        setConfirm({ region: r.id });
                      }}
                    >
                      <span>{r.name}</span>
                      <small>{busyRegion ? "Dọn lại" : "Chưa cần dọn"}</small>
                    </button>
                  );
                })}
              </div>
              {done && (
                <p className={cn("adult-done")} role="status">
                  <Icon name="yes" size={20} /> {done}
                </p>
              )}
              <h3>Bắt đầu lại từ đầu</h3>
              <p className={cn("footnote")}>
                Xóa tất cả: các khu đã mở, sổ khám phá, bạn thú và giỏ đồ.
              </p>
              <button
                className={cn("danger")}
                onClick={() => {
                  setDone("");
                  setConfirm("all");
                }}
              >
                <Icon name="broom" size={20} /> Bắt đầu lại tất cả
              </button>
            </>
          )}
          {target && (
            <>
              <h3>Dọn lại {target.name}?</h3>
              <p>
                Luống trồng
                {target.id === "garden" ? " và đồ trang trí" : ""} sẽ trống. Sổ
                khám phá, bạn thú và giỏ đồ vẫn còn.
              </p>
              <div className={cn("adult-actions")}>
                <button
                  className={cn("quiet-primary")}
                  onClick={() => {
                    p.act({ type: "resetRegion", region: target.id });
                    setDone(`Đã dọn xong ${target.name}`);
                    setConfirm(null);
                  }}
                >
                  Dọn lại
                </button>
                <button onClick={() => setConfirm(null)}>Giữ nguyên</button>
              </div>
            </>
          )}
          {confirm === "all" && (
            <>
              <h3>Bắt đầu lại từ đầu?</h3>
              <p>
                Mọi thứ sẽ về như lần đầu chơi: chỉ còn Vườn nhà, sổ khám phá và
                giỏ đồ trống. Không thể hoàn tác.
              </p>
              <div className={cn("adult-actions")}>
                <button
                  className={cn("danger")}
                  onClick={() => {
                    p.act({ type: "resetAll" });
                    setConfirm(null);
                    setDone("");
                    p.say("Một khu vườn mới đang đợi con khám phá!");
                    p.onClose();
                  }}
                >
                  Xóa hết, bắt đầu lại
                </button>
                <button onClick={() => setConfirm(null)}>Giữ nguyên</button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
