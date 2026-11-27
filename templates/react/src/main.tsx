import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./app.css"
import { App } from "./App"
import { dictionary, home } from "./app/content"

document.documentElement.lang = dictionary.locale
document.title = home.seo.title
document.querySelector('meta[name="description"]')?.setAttribute("content", home.seo.description)

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
