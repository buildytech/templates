import { mount } from "svelte"
import "./app.css"
import App from "./App.svelte"
import { bindBehaviors } from "./app/behaviors"
import { dictionary, home } from "./app/content"

document.documentElement.lang = dictionary.locale
document.title = home.seo.title
document.querySelector('meta[name="description"]')?.setAttribute("content", home.seo.description)

const app = mount(App, { target: document.getElementById("app")! })
bindBehaviors()

export default app
