import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// The desktop host runs the dev server on 127.0.0.1 and shows it through its preview proxy: HMR_CLIENT_PORT is the
// proxy port the browser talks to (HMR_PROTOCOL ws). Without them Vite's defaults apply.
const hmrPort = process.env.HMR_CLIENT_PORT ? Number(process.env.HMR_CLIENT_PORT) : undefined
const hmrProtocol = process.env.HMR_PROTOCOL

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    allowedHosts: true,
    hmr: {
      ...(hmrPort ? { clientPort: hmrPort } : {}),
      ...(hmrProtocol === "ws" || hmrProtocol === "wss" ? { protocol: hmrProtocol } : {}),
    },
  },
})
