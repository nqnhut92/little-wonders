import { useEffect, useState } from "react";
import { cn } from "../styles";
import { Icon } from "./Icons";
import { UPDATE_READY } from "../services/update";
// A new version is ready while the child is still in the garden. A calm dialog offers the reload;
// there is no timer and nothing is forced. A hidden tab reloads by itself (see services/update.ts).
export function UpdatePrompt() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const show = () => setReady(true);
    window.addEventListener(UPDATE_READY, show);
    return () => window.removeEventListener(UPDATE_READY, show);
  }, []);
  if (!ready) return null;
  return (
    <div className={cn("modal-shade")} style={{ zIndex: 90 }}>
      <section
        className={cn("modal activity")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-title"
      >
        <div className={cn("modal-body")}>
          <div className={cn("prompt-icon")}>
            <Icon name="cloud-saved" size={56} />
          </div>
          <h2 id="update-title">Vườn có bản mới rồi!</h2>
          <p>
            Tải lại trang để vào bản mới nhé. Những gì con đã chơi vẫn được giữ.
          </p>
          <button
            type="button"
            className={cn("quiet-primary")}
            onClick={() => location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      </section>
    </div>
  );
}
