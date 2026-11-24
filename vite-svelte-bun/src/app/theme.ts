// Dark mode: the `dark` class on <html> (src/styles/theme.css). The choice is kept in localStorage; without one the
// system preference wins. The kit's ThemeToggle (data-ui8kit="theme-toggle") is a plain button; this wires it.
const KEY = "theme"

function isDark(): boolean {
  return document.documentElement.classList.contains("dark")
}

function setDark(dark: boolean): void {
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
  for (const el of document.querySelectorAll<HTMLElement>('[data-ui8kit="theme-toggle"]')) {
    el.setAttribute("aria-pressed", String(dark))
  }
}

export function applyStoredTheme(): void {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(KEY)
  } catch {
    stored = null
  }
  const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
  setDark(dark)
}

export function bindThemeToggles(): void {
  setDark(isDark())
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-ui8kit="theme-toggle"]') : null
    if (!target) return
    const dark = !isDark()
    setDark(dark)
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light")
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  })
}
