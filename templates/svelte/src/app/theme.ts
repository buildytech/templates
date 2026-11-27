// Dark mode, framework-free (the same file in every runtime of this starter). The state lives in the framework
// (site-header: `$state` / `useState`) and reaches ARIA only through the Button primitive's `pressed` prop; this file
// only reads and stores the choice and puts the `dark` class on <html> (the document root, outside the app, which no
// primitive renders). index.html applies the stored choice before the first paint.
const KEY = "theme"

/** The stored choice, or null when the visitor has not chosen (the system preference wins). */
export function storedDark(): boolean | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === "dark" ? true : v === "light" ? false : null
  } catch {
    return null
  }
}

/** The current mode: what index.html applied before the first paint. */
export function initialDark(): boolean {
  return document.documentElement.classList.contains("dark")
}

export function storeDark(dark: boolean): void {
  try {
    localStorage.setItem(KEY, dark ? "dark" : "light")
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

export function applyDark(dark: boolean): void {
  document.documentElement.classList.toggle("dark", dark)
}

/** Calls back when the system preference changes and the visitor has no stored choice; returns the unsubscribe. */
export function onSystemDark(cb: (dark: boolean) => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  const on = (e: MediaQueryListEvent) => {
    if (storedDark() === null) cb(e.matches)
  }
  mq.addEventListener("change", on)
  return () => mq.removeEventListener("change", on)
}
