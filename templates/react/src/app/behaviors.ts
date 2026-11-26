// Behaviour of the kit's plain buttons, framework-free (the same file in every runtime of this starter):
//  - ThemeToggle (data-ui8kit="theme-toggle"): the `dark` class on <html>, kept in localStorage; without a stored
//    choice the system preference wins. index.html applies the stored choice before the first paint.
//  - SheetTrigger (data-ui8kit="sheet-trigger", aria-controls = the Sheet's id): opens the native <dialog> as a modal
//    (focus stays inside, Escape closes, the page behind is inert), locks the page scroll and returns focus on close.
//    SheetClose, a click on the backdrop and a click on a link inside the sheet close it.
import { lockScroll } from "../utils/a11y"

const THEME_KEY = "theme"

function storedTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

function setDark(dark: boolean): void {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  for (const el of document.querySelectorAll('[data-ui8kit="theme-toggle"]')) el.setAttribute("aria-pressed", String(dark))
}

function isDark(): boolean {
  return document.documentElement.classList.contains("dark")
}

function openSheet(trigger: Element, sheet: HTMLDialogElement): void {
  if (sheet.open) return
  const release = lockScroll()
  sheet.showModal()
  trigger.setAttribute("aria-expanded", "true")
  sheet.addEventListener(
    "close",
    () => {
      release()
      trigger.setAttribute("aria-expanded", "false")
      if (trigger instanceof HTMLElement) trigger.focus()
    },
    { once: true },
  )
}

let bound = false

/** Wires the theme toggles and the sheets of the page; call once after the app is mounted. */
export function bindBehaviors(): void {
  setDark(isDark())
  if (bound) return
  bound = true
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!storedTheme()) setDark(e.matches)
  })
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target) return
    if (target.closest('[data-ui8kit="theme-toggle"]')) {
      const dark = !isDark()
      setDark(dark)
      try {
        localStorage.setItem(THEME_KEY, dark ? "dark" : "light")
      } catch {
        // Private mode: the choice lasts for this page only.
      }
      return
    }
    const trigger = target.closest('[data-ui8kit="sheet-trigger"]')
    if (trigger) {
      const sheet = document.getElementById(trigger.getAttribute("aria-controls") ?? "")
      if (sheet instanceof HTMLDialogElement) openSheet(trigger, sheet)
      return
    }
    if (target.closest('[data-ui8kit="sheet-close"]')) {
      target.closest("dialog")?.close()
      return
    }
    // The sheet fills the viewport; its panel is the only child, so a click on the dialog itself is the backdrop.
    if (target instanceof HTMLDialogElement && target.open) {
      target.close()
      return
    }
    const link = target.closest("dialog[open] a[href]")
    if (link) link.closest("dialog")?.close()
  })
}
