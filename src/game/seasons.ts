export type SeasonalEvent = "tet" | "mid_autumn" | null;

/**
 * Detects Vietnamese Lunar New Year (Tet) or Mid-Autumn Festival from the browser's
 * built-in Chinese/Vietnamese lunar calendar, with an optional URL-query override for testing.
 */
export function currentSeasonalEvent(
  now: Date = new Date(),
  override?: string | null,
): SeasonalEvent {
  if (override === "tet" || override === "mid_autumn") return override;
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-chinese", {
      month: "numeric",
      day: "numeric",
    }).formatToParts(now);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    const day = Number(parts.find((p) => p.type === "day")?.value);
    if ((month === 1 && day >= 1 && day <= 7) || (month === 12 && day >= 28))
      return "tet";
    if (month === 8 && day >= 13 && day <= 16) return "mid_autumn";
  } catch {
    /* ignore if ICU lunar calendar is unavailable */
  }
  return null;
}

export function seasonalInfo(event: Exclude<SeasonalEvent, null>) {
  if (event === "tet") {
    return {
      id: "tet",
      label: "Hoa mai ngày Tết",
      art: "flower",
      line: "Chúc mừng năm mới! Cành mai vàng nở rộ đón Tết cùng con và Lucky nè!",
    };
  }
  return {
    id: "mid_autumn",
    label: "Đèn ông sao Trung thu",
    art: "star-lantern",
    line: "Tết Trung thu tới rồi! Đèn ông sao lung linh soi sáng khu vườn đêm nay đó!",
  };
}
