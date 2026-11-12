import { useEffect, useState } from "react";
import { cn } from "../styles";
import { Icon } from "./Icons";
// Touch screens held upright get a full-screen prompt to turn sideways. A web app cannot lock the
// orientation on iPad, so the game asks instead; desktop windows never see it. Nothing to tap: it
// disappears by itself as soon as the screen is turned.
const PORTRAIT_TOUCH = "(pointer: coarse) and (orientation: portrait)";
export function RotatePrompt() {
  const [portrait, setPortrait] = useState(
    () => window.matchMedia(PORTRAIT_TOUCH).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(PORTRAIT_TOUCH);
    const sync = () => setPortrait(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  if (!portrait) return null;
  return (
    <div className={cn("modal-shade")} style={{ zIndex: 100 }}>
      <section
        className={cn("modal activity")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rotate-title"
      >
        <div className={cn("modal-body")}>
          <div className={cn("prompt-icon")}>
            <Icon name="rotate" size={64} />
          </div>
          <h2 id="rotate-title">Xoay ngang màn hình nhé!</h2>
          <p>
            Tắt khóa xoay trong Trung tâm điều khiển, rồi xoay iPad ngang để vào
            vườn.
          </p>
        </div>
      </section>
    </div>
  );
}
