import { mount } from "svelte"
import "./styles/index.css"
import App from "./App.svelte"
import { page } from "./app/page"
import { applyStoredTheme, bindThemeToggles } from "./app/theme"

applyStoredTheme()
document.documentElement.lang = page.locale
document.title = page.seo?.title || page.title
const description = page.seo?.description
if (description) {
  const meta = document.createElement("meta")
  meta.name = "description"
  meta.content = description
  document.head.append(meta)
}

const app = mount(App, { target: document.getElementById("app")! })
bindThemeToggles()

export default app
