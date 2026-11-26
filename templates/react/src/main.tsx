import { StrictMode } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import "./app.css"
import { App } from "./App"
import { bindBehaviors } from "./app/behaviors"
import { dictionary, home } from "./app/content"

document.documentElement.lang = dictionary.locale
document.title = home.seo.title
document.querySelector('meta[name="description"]')?.setAttribute("content", home.seo.description)

// Rendered synchronously, so the behaviours below find the kit's buttons in the DOM.
const root = createRoot(document.getElementById("app")!)
flushSync(() =>
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
)
bindBehaviors()
