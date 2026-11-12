/** Normalizes displayed or pronounced variants to one canonical audio-manifest key. */
export function voiceKey(text: string): string {
  return text
    .replaceAll("Lắc-ki", "Lucky")
    .replaceAll("lắc-ki", "lucky")
    .replaceAll("Ca-pi-ba-ra", "Capybara")
    .replaceAll("ca-pi-ba-ra", "capybara")
    .replace(/\bBạn bạn /g, "Bạn ")
    .replace(/\bbạn bạn /g, "bạn ")
    .trim();
}
