import { defineConfig } from "vite"

// The host runs the dev server on 127.0.0.1 with --port and shows it through its preview proxy: HMR_CLIENT_PORT is
// the proxy port the browser talks to (HMR_PROTOCOL ws | wss). Without them Vite's defaults apply.
const hmrPort = process.env.HMR_CLIENT_PORT ? Number(process.env.HMR_CLIENT_PORT) : undefined
const hmrProtocol = process.env.HMR_PROTOCOL

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
    allowedHosts: true,
    hmr: {
      ...(hmrPort ? { clientPort: hmrPort } : {}),
      ...(hmrProtocol === "ws" || hmrProtocol === "wss" ? { protocol: hmrProtocol } : {}),
    },
  },
  preview: { host: "127.0.0.1", port: 4173 },
})
