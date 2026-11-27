// The native <dialog> as a modal, framework-free (the same file in every runtime of this starter). The kit's Dialog
// primitive leaves opening to the consumer ("Opening/closing (showModal) is the consumer's"); the open state lives in
// the framework (site-header) and reaches ARIA only through the Button primitive's `expanded` prop. showModal() gives
// the focus trap, Escape, the inert page behind and the top layer; this adds the scroll lock and the focus return.
import { lockScroll } from "../utils/a11y"

/** Opens the dialog `id` as a modal; the returned cleanup closes it, unlocks the scroll and returns focus. */
export function openModal(id: string): () => void {
  const el = document.getElementById(id)
  if (!(el instanceof HTMLDialogElement)) return () => {}
  const back = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const release = lockScroll()
  if (!el.open) el.showModal()
  return () => {
    if (el.open) el.close()
    release()
    back?.focus()
  }
}

/** A click on the dialog itself (the sheet fills the viewport, so that is the backdrop) or on a link inside closes. */
export function closesSheet(event: { target: EventTarget | null; currentTarget: EventTarget | null }): boolean {
  const t = event.target
  return t === event.currentTarget || (t instanceof Element && t.closest("a[href]") !== null)
}
