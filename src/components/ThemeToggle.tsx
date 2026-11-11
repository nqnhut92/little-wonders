import { useEffect, useRef, useState } from "react";
import { cn } from "../styles";
import {
  createThemeController,
  themeLabel,
  themeOrder,
  themePaths,
  type ThemeController,
  type ThemePreference,
} from "../ui/theme-controller.js";
// Keep the key and colors identical to the pre-paint script in index.html.
export const themeStorageKey = "little-wonders-theme";
export const themeColors = { light: "#edf4d2", dark: "#131b22" };
function initial(): ThemePreference {
  const saved = document.documentElement.dataset.themePreference;
  return themeOrder.includes(saved as ThemePreference)
    ? (saved as ThemePreference)
    : "system";
}
// Appearance of the interface only. The game's own day and night is separate state.
export function ThemeToggle() {
  const controller = useRef<ThemeController | null>(null);
  const [preference, setPreference] = useState<ThemePreference>(initial);
  useEffect(() => {
    const created = createThemeController({
      storageKey: themeStorageKey,
      colors: themeColors,
      onChange: (state) => setPreference(state.preference),
    });
    controller.current = created;
    return () => {
      created.destroy();
      controller.current = null;
    };
  }, []);
  const label = themeLabel(preference, "vi");
  return (
    <button
      type="button"
      className={cn("theme-toggle")}
      data-mode={preference}
      aria-label={label}
      title={label}
      onClick={() => controller.current?.cycle()}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: themePaths[preference] }}
      />
    </button>
  );
}
