/**
 * The one way to switch shift. Both the toggle and the command palette call
 * this, so the attribute, the stored preference and the browser-chrome colour
 * can never drift apart.
 */
export type Shift = "dark" | "light";

const CHROME: Record<Shift, string> = {
  dark: "#131311",
  light: "#f2efe7",
};

export function applyTheme(next: Shift): void {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("cr-theme", next);
  } catch {}
  // Keep the phone's browser chrome on the same shift as the console.
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => (m.content = CHROME[next]));
}
